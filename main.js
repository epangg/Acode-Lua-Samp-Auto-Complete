(function () {
    "use strict";

    var PLUGIN_ID = "samp.lua.autocomplete";
    var API = [];
    var cmExtension = null;

    async function loadAPI(baseUrl) {
        try {
            var url = baseUrl.endsWith("/") ? baseUrl + "autocomplete.json" : baseUrl + "/autocomplete.json";
            var response = await fetch(url);

            if (!response.ok) {
                throw new Error("HTTP " + response.status);
            }

            API = await response.json();
            console.log("[Samp Lua Autocomplete] Berhasil load " + API.length + " data.");
            return true;
        } catch (e) {
            console.error("[Samp Lua Autocomplete] Waduh, autocomplete.json gagal dibaca:", e);
            API = [];
            return false;
        }
    }

    function isLuaFile() {
        var name = editorManager.activeFile && editorManager.activeFile.name;
        return !!name && /\.lua$/i.test(name);
    }

    function buildAceCompletions() {
        return API.map(function (item) {
            return {
                caption: item.name,
                snippet: item.value || item.name,
                meta: item.meta || "moonloader",
                score: item.score || 1000,
                docHTML: "<b>" + item.name + "</b><hr>" + (item.doc || "Dokumentasinya belum ada.")
            };
        });
    }

    var moonloaderCompleter = {
        getCompletions: function (editor, session, pos, prefix, callback) {
            try {
                var mode = (session && session.$modeId) || "";
                if (mode.indexOf("lua") === -1) {
                    callback(null, []);
                    return;
                }
                callback(null, buildAceCompletions());
            } catch (e) {
                callback(null, []);
            }
        }
    };

    function enableAce() {
        var editor = editorManager.editor;
        if (!editor || !editor.completers) return;

        var already = editor.completers.indexOf(moonloaderCompleter) !== -1;
        if (!already) editor.completers.push(moonloaderCompleter);

        editor.setOptions({
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true
        });
    }

    function disableAce() {
        var editor = editorManager.editor;
        if (!editor || !editor.completers) return;

        var index = editor.completers.indexOf(moonloaderCompleter);
        if (index !== -1) editor.completers.splice(index, 1);
    }

    function buildCmSource(cm) {
        var snippet = cm.autocomplete.snippet;

        var seen = {};
        var dedupedAPI = [];
        for (var i = 0; i < API.length; i++) {
            var item = API[i];
            if (!seen[item.name]) {
                seen[item.name] = true;
                dedupedAPI.push(item);
            }
        }

        return function cmCompletionSource(context) {
            var word = context.matchBefore(/\w*/);
            if (!word || (word.from === word.to && !context.explicit)) {
                return null;
            }

            var query = word.text.toLowerCase();

            var filtered = query
                ? dedupedAPI.filter(function (item) {
                      return item.name.toLowerCase().indexOf(query) !== -1;
                  })
                : dedupedAPI;

            filtered.sort(function (a, b) {
                var aStarts = a.name.toLowerCase().indexOf(query) === 0 ? 0 : 1;
                var bStarts = b.name.toLowerCase().indexOf(query) === 0 ? 0 : 1;
                if (aStarts !== bStarts) return aStarts - bStarts;
                return a.name.length - b.name.length;
            });

            filtered = filtered.slice(0, 50);

            var options = filtered.map(function (item) {
                var template = item.value || item.name;
                return {
                    label: item.name,
                    apply: snippet(template),
                    detail: item.meta || "moonloader",
                    info: item.doc || "Dokumentasinya belum ada.",
                    type: "function"
                };
            });

            return {
                from: word.from,
                options: options,
                filter: false
            };
        };
    }

    var cmInstalled = false;

    function enableCm() {
        if (cmInstalled) return;

        var cm = acode.require("codemirror");
        var view = editorManager.editor;
        var source = buildCmSource(cm);

        cmExtension = cm.state.EditorState.languageData.of(function (state, pos, side) {
            if (!isLuaFile()) return [];
            return [{ autocomplete: source }];
        });

        try {
            view.dispatch({
                effects: cm.state.StateEffect.appendConfig.of(cmExtension)
            });
            cmInstalled = true;
            console.log("[Samp Lua Autocomplete] Completion source terpasang (CodeMirror).");
        } catch (e) {
            console.error("[Samp Lua Autocomplete] Gagal pasang completion source:", e);
        }
    }

    function disableCm() {
        cmExtension = null;
        cmInstalled = false;
    }

    function enableCompleter() {
        if (editorManager.isCodeMirror) {
            enableCm();
        } else {
            enableAce();
        }
    }

    function disableCompleter() {
        if (editorManager.isCodeMirror) {
            disableCm();
        } else {
            disableAce();
        }
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
