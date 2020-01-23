const Modules = {
	_modules: [],
	registerModule: function(name, fn) {
		Modules._modules.push({ name: name, fn: fn });
	},
	load: function() {
		if (window.location.href === "https://ru-minecraft.ru/index.php?action=logout") return;

		if (localStorage.getItem("_logout") === "do") {
			document.write("Вхожу в аккаунт...");
			localStorage.setItem("_logout", "refresh"); 
			return setTimeout(() => window.location.href = "https://ru-minecraft.ru/", 1000);
		}

		if (localStorage.getItem("_logout") === "refresh") {
			localStorage.setItem("_logout", "1");
			Modules._modules.find(e => e.name === "MultiAccount").fn();
			return window.loginMultiaccount();
		}

		if (document.getElementById('login_password')) return;
		if (window.location.href.startsWith("https://ru-minecraft.ru/out?")) return;

		if (!window.jQuery) return;

		try {
			Notification.requestPermission();

			Modules._modules.forEach(function(m) {
				Utils.debug(`Состояние модуля ${m.name}: ${localStorage.getItem(m.name + "_enabled") !== "0"}`);
				if (localStorage.getItem(m.name + "_enabled") !== "0") m.fn();
			});

		} catch (e) {
			document.write("<pre><center><h1>Невозможно инициализировать RuMine++</h1></center><br><br>");
			document.write(e.stack + "");
			document.write("<br><br><i>" + navigator.userAgent + "</i></pre>");
		}
	}
};
