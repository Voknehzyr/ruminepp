Modules.registerModule("RuMinePP", function() {
	const container = $(".topmenu-profile ul")[0];
	let rmppSettingsLi = document.createElement("li");
	let rmppSettings = document.createElement("a");

	rmppSettingsLi.appendChild(rmppSettings);

	rmppSettings.href = "#";
	rmppSettings.onclick = function() { 
		PageAPI.popup("Настройки RuMine++", HTML.get("settings.html"), {
			"Применить": function() {
				Array.from($(".rmppSetting")).forEach(e => localStorage.setItem(e.getAttribute("id") + "_enabled", e.checked ? "1" : "0"));
				localStorage.setItem("emoticons_urls", $("#CustomEmoticons_urls").val());
				window.location.reload();
			}
		});

		$("#CustomEmoticons_urls").val(localStorage.getItem("emoticons_urls") || "");
		$("#CustomEmoticons_urls").prop("disabled", localStorage.getItem("CustomEmoticons_enabled") === "0");
		Array.from($(".rmppSetting")).forEach(e => e.checked = localStorage.getItem(e.getAttribute("id") + "_enabled") !== "0");

		return false;
	}
	rmppSettings.style.color = '#37cccf';
	rmppSettings.innerHTML = "Настройки RuMine++";

	container.appendChild(rmppSettingsLi);
});
