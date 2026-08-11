(function () {
    "use strict";

    var PLUGIN_ID = "lua.samp.autocomplete";
    var API = [];

    async function loadAPI(baseUrl) {
        try {
            var response = await fetch(baseUrl + "/autocomplete.json");

            if (!response.ok) {
                throw new Error("HTTP " + response.status);
            }

            API = await response.json();

            console.log(
                "[Lua Samp Autocomplete] Berhasil load " +
                API.length +
                " data."
            );

            return true;
        } catch (e) {
            console.error(
                "[Lua Samp Autocomplete] Waduh, autocomplete.json gagal dibaca:",
                e
            );

            API = [];
            return false;
        }
    }

    function buildCompletions() {
        return API.map(function (item) {
            return {
                caption: item.name,
                snippet: item.value || item.name,
                meta: item.meta || "moonloader",
                score: item.score || 1000,
                docHTML:
                    "<b>" +
                    item.name +
                    "</b><hr>" +
                    (item.doc || "Dokumentasinya belum ada.")
            };
        });
    }

    var moonloaderCompleter = {
        getCompletions: function (
            editor,
            session,
            pos,
            prefix,
            callback
        ) {
            try {
                var mode = session.$modeId || "";

                if (mode.indexOf("lua") === -1) {
                    callback(null, []);
                    return;
                }

                callback(null, buildCompletions());
            } catch (e) {
                callback(null, []);
            }
        }
    };

    function enableCompleter() {
        var editor = editorManager.editor;

        if (!editor || !editor.completers) {
            return;
        }

        var already =
            editor.completers.indexOf(moonloaderCompleter) !== -1;

        if (!already) {
            editor.completers.push(moonloaderCompleter);
        }

        editor.setOptions({
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true
        });
    }

    function disableCompleter() {
        var editor = editorManager.editor;

        if (!editor || !editor.completers) {
            return;
        }

        var index =
            editor.completers.indexOf(moonloaderCompleter);

        if (index !== -1) {
            editor.completers.splice(index, 1);
        }
    }

    acode.setPluginInit(
        PLUGIN_ID,
        async function (baseUrl, $page, cache) {
            var loaded = await loadAPI(baseUrl);

            if (!loaded) {
                return;
            }

            enableCompleter();
        }
    );

    acode.setPluginUnmount(
        PLUGIN_ID,
        function () {
            disableCompleter();
        }
    );
})();