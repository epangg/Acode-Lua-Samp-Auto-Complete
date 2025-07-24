!function(){
  const pluginId = "acode.luasampautocomplete";
  const { editor } = editorManager;

  const luaMoonCompleter = {
    id: "luasamp-autocomplete",
    getCompletions(editor, session, pos, prefix, callback) {
      const completions = [
        { caption: "require", value: "local nama = require 'nama'", meta: "Lua", score: 1000 },
        { caption: "script_name", value: "script_name('')", meta: "MoonLoader", score: 1000 },
        { caption: "script_author", value: "script_author('')", meta: "MoonLoader", score: 1000 },
        { caption: "script_description", value: "script_description('')", meta: "MoonLoader", score: 1000 },
        { caption: "script_version", value: "script_version('1.0')", meta: "MoonLoader", score: 1000 },

        { caption: "require imgui", value: "local imgui = require 'mimgui'", meta: "UI", score: 1000 },
        { caption: "imgui.OnFrame", value: "function imgui.OnFrame()\n    function() return showUI[0] end,\n    function()\n        imgui.SetNextWindowSize(imgui.ImVec2(600, 700), imgui.Cond.FirstUseEver)\n        imgui.Begin('Epang', showUI, imgui.WindowFlags.NoCollapse)\n        imgui.Text('Halo SA-MP!')\n        imgui.End()\n    end\nend", meta: "UI", score: 1000 },
        { caption: "imgui.new.bool", value: "imgui.new.bool(false)", meta: "imgui", score: 1000 },
        { caption: "imgui.new.char", value: "imgui.new.char[size]()", meta: "imgui", score: 1000 },
        { caption: "imgui.new.float", value: "imgui.new.float(0.0)", meta: "imgui", score: 1000 },
        { caption: "imgui.Text", value: "imgui.Text('')", meta: "imgui", score: 1000 },
        { caption: "imgui.InputText", value: "imgui.InputText('Label', teks)", meta: "imgui", score: 1000 },

        { caption: "sampRegisterChatCommand", value: "sampRegisterChatCommand('cmd', function())", meta: "SA-MP", score: 1000 },
        { caption: "sampAddChatMessage", value: "sampAddChatMessage('Pesan', -1)", meta: "SA-MP", score: 1000 },
        { caption: "sampIsChatInputActive", value: "sampIsChatInputActive()", meta: "SA-MP", score: 1000 },
        { caption: "sampSendChat", value: "sampSendChat('/cmd')", meta: "SA-MP", score: 1000 },
        { caption: "sampGetPlayerIdByNickname", value: "sampGetPlayerIdByNickname('Nama')", meta: "SA-MP", score: 1000 },
        { caption: "sampGetPlayerNickname", value: "sampGetPlayerNickname(playerId)", meta: "SA-MP", score: 1000 },

        { caption: "lua_thread.create", value: "lua_thread.create(function()\n\nend)", meta: "Thread", score: 1000 },
        { caption: "wait", value: "wait(0)", meta: "Thread", score: 1000 },

        { caption: "thisScript", value: "thisScript()", meta: "MoonLoader", score: 1000 },
        { caption: "thisScript():unload", value: "thisScript():unload()", meta: "MoonLoader", score: 1000 },

        { caption: "event.onSendPacket", value: "function sampev.onSendPacket(id, bs)\n    return true\nend", meta: "samp.events", score: 1000 },
        { caption: "event.onServerMessage", value: "function sampev.onServerMessage(color, msg)\n    return {color, msg}\nend", meta: "samp.events", score: 1000 },
        { caption: "onSendRpc", value: "function sampev.onSendRpc(rpcid, bs)\n    return true\nend", meta: "samp.events", score: 1000 },

        { caption: "inicfg.load", value: "local config = inicfg.load(nil, 'config')", meta: "inicfg", score: 1000 },
        { caption: "inicfg.save", value: "inicfg.save(config, 'config')", meta: "inicfg", score: 1000 },

        { caption: "ffi.cdef", value: "ffi.cdef[[\n    typedef struct {\n        float x, y, z;\n    } VECTOR;\n]]", meta: "FFI", score: 1000 },
        { caption: "memory.getint32", value: "memory.getint32(address)", meta: "Memory", score: 1000 },
        
        { caption: "main", value: "function main()\n    while not isSampAvailable() do wait(0) end\n\n    while true do\n        wait(0)\n    end\nend", meta: "Lua", score: 1000 },

        { caption: "vkeys", value: "require 'vkeys'", meta: "MoonLoader", score: 1000 },
        { caption: "isKeyJustPressed", value: "isKeyJustPressed(VK_F2)", meta: "MoonLoader", score: 1000 }
      ];

      callback(null, completions);
    }
  };

  if (window.acode) {
    acode.setPluginInit(pluginId, () => {
      editor.completers.push(luaMoonCompleter);
    });

    acode.setPluginUnmount(pluginId, () => {
      const index = editor.completers.indexOf(luaMoonCompleter);
      if (index !== -1) editor.completers.splice(index, 1);
    });
  }
}();