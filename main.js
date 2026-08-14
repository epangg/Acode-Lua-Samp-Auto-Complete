(function () {
    "use strict";

    var PLUGIN_ID = "lua.samp.autocomplete";
    var API = [];

    async function loadAPI(baseUrl) {
        try {
            var response = await fetch(baseUrl + "autocomplete.json");
            if (!response.ok) throw new Error("HTTP " + response.status);
            API = await response.json();
            console.log("[Lua Samp Autocomplete] Berhasil load " + API.length + " data.");
            return true;
        } catch (e) {
            console.error("[Lua Samp Autocomplete] Gagal load autocomplete.json:", e);
            API = [];
            return false;
        }
    }

    function luaCompletionSource(context) {
        var word = context.matchBefore(/\w*/);
        if (!word || (word.from === word.to && !context.explicit)) {
            return null;
        }

        var snippetFn = acode.require("autocomplete")?.snippet
            || window.CodeMirrorAutocomplete?.snippet;

        var options = API.map(function (item) {
            var applyFn = item.value
                ? snippetFn(item.value)
                : undefined;

            return {
                label: item.name,
                apply: applyFn,
                detail: item.meta || "moonloader",
                info: function () {
                    var el = document.createElement("div");
                    el.innerHTML = item.doc || "Dokumentasinya belum ada.";
                    return el;
                },
                type: "function",
                boost: 99
            };
        });

        return {
            from: word.from,
            options: options,
            validFor: /^\w*$/
        };
    }

    function enableCompleter() {
        var editorLanguages = acode.require("editorLanguages");
        editorLanguages.setCompletion?.("lua", luaCompletionSource);
    }

    function disableCompleter() {
        var editorLanguages = acode.require("editorLanguages");
        editorLanguages.setCompletion?.("lua", null);
    }

    acode.setPluginInit(PLUGIN_ID, async function (baseUrl, $page, cache) {
        var loaded = await loadAPI(baseUrl);
        if (!loaded) return;
        enableCompleter();
    });

    acode.setPluginUnmount(PLUGIN_ID, function () {
        disableCompleter();
    });
})();