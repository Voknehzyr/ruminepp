Modules.registerModule("ForumMessagesUpdater", function () {
	if (!PageAPI.isForumTopic()) return;

	Notification.requestPermission();

	let currentPage = null;
	let editing = null;

	function getNewMessages(cb) {
		$.ajax({
			success: function (content) {
				cb({
					messages: PageAPI.getForumMessages(content),
					page: PageAPI.getForumPage(content)
				});
			}
		});
	}

	function tick() {
		const current = PageAPI.getForumMessages();

		getNewMessages(function (actual) {
			if (current.length !== actual.messages.length) {
				actual.messages.slice(current.length).forEach(function (msg) {
					PageAPI.appendForumMessage(msg);

					const info = PageAPI.getMessageInfo(msg);

					let notification = new Notification(info.username, {
						body: info.text,
						icon: info.avatar
					});

					setTimeout(() => notification.close(), 6000);
				});
			}

			current.forEach(function (c, i) {
				// console.log(actual.messages[i].innerHTML);
				if (c.getAttribute("id").endsWith(editing)) return;

				if ($(".addMsgForm", $(c)).text() !== $(".addMsgForm", $(actual.messages[i])).text()) {
					if (window._pushHistory) {
						window._pushHistory(actual.messages[i]);
						PageAPI.appendHistoryBtn(actual.messages[i]);
					}


					$("#" + c.getAttribute("id")).html(actual.messages[i].innerHTML);
				}
			});

			if (currentPage !== null && currentPage !== actual.page) {
				currentPage = actual.page;

				PageAPI.popup("Опа!", "Появилась новая страница!", {
					"Перейти": function () {
						window.location.href = window.location.href.replace("page-" + (actual.page - 1), "page-" + actual.page);
					}
				});

				new Notification("Новая страница!", {
					body: "На форуме появилась новая страница"
				});
			}

			if (currentPage === null) currentPage = actual.page;

			current.forEach(function (msg, i) {

				// Обновляем карточку юзера если в ней устарела информация.
				if ($(".forum-topicMsgUser", $(msg))[0].innerText.replace(/\s/g, '') !== $(".forum-topicMsgUser", $(actual.messages[i]))[0].innerText.replace(/\s/g, '')) {
					console.log("Обнаружено изменение профиля " + PageAPI.getMessageInfo(msg).username);
					$(".forum-topicMsgUser", $(msg))[0].innerHTML = $(".forum-topicMsgUser", $(actual.messages[i]))[0].innerHTML;
				}

				// Сообщение юзера если в нем произошли изменения.
				if ($("#forum-topicMsgShtuff", $(msg))[0].innerHTML !== $("#forum-topicMsgShtuff", $(actual.messages[i]))[0].innerHTML) {
					if ($("#message_edit_form", $(msg))[0] !== undefined) return;
					// Проверка на наличие изменений внутри текста.
					if (PageAPI.getMessageInfo(msg).text == PageAPI.getMessageInfo(actual.messages[i]).text) return;

					// Проверка на наличие открытого спойлера в сообщении.
					let hasSpoilersOpened = false;
					($("#forum-topicMsgShtuff", $(msg))[0].querySelectorAll('.text_spoiler')).forEach((spoiler) => {
						if (spoiler.style.display !== "none") return hasSpoilersOpened = true;
					})

					// Не обновляем сообщение если открыты спойлеры.
					if (hasSpoilersOpened) return;
					
					$("#forum-topicMsgShtuff", $(msg))[0].innerHTML = $("#forum-topicMsgShtuff", $(actual.messages[i]))[0].innerHTML;
					Utils.debug("Обнаружено изменение сообщения " + PageAPI.getMessageInfo(msg).username);
				}

			});

		});
	}

	var pageUpdateInteval = setInterval(() => tick(), 2000);

	// Inject
	window.MsgEdit = Injector.before(window.MsgEdit, (id) => editing = id);
	window.MsgEditSave = Injector.before(window.MsgEditSave, () => editing = null);
	window.MsgEditCancel = Injector.before(window.MsgEditCancel, () => editing = null);

	// Redefine default functions
	window.doAddMessage = function () {
		var a = document.getElementById("message_add_form");
		if (a.text_msg.value == "") {
			Alert_popup(lang[0][29][6], lang[0][23][0]);
			return false
		}
		if (a.recaptcha_response_field) {
			var b = Recaptcha.get_response();
			var c = Recaptcha.get_challenge()
		} else if (a.question) {
			var b = a.question.value;
			var c = a.question_sec.value
		} else {
			var b = "";
			var c = ""
		}
		Ajax_Loading("");
		var d = new Array;
		$("#message_add_form input[class='marker_file_ajax']").each(function (a, b) {
			d.push($(b).val())
		});
		if (forum_cpu) {
			var e = dle_root + forum_path + "/add/" + a.topict_id.value + "/post"
		} else {
			var e = dle_root + "index.php?do=" + forum_path + "&action=newpost&id=" + a.topict_id.value + "&param=post"
		}
		$.post(e, {
			text_msg: a.text_msg.value,
			topic_id: a.topict_id.value,
			recaptcha_response_field: b,
			recaptcha_challenge_field: c,
			id_file: d
		}, function (b) {
			Ajax_close("");
			if (b.param == 0) {
				Alert_popup(b.data, lang[0][23][0]);
				return false
			}
			setElementForum()
			$("#text_msg").val("");
		}, "json");
	}
});
