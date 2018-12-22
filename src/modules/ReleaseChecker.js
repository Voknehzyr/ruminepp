Modules.registerModule("ReleaseChecker", function() {
		$.ajax({
			url: "https://api.github.com/repos/Voknehzyr/ruminepp/releases",
			success: function(result) {
				if (result[0].tag_name <= RMPPVersion)
					return;  

				PageAPI.popup("Новая версия RuMine++", "<br>Появилась новая версия RuMine++ <b>" + result[0].tag_name + "</b>", {
					"Скачать новую версию": function() {
						window.location.href = "https://github.com/Voknehzyr/ruminepp/releases/latest";
					}
				});
			}
		});
});
