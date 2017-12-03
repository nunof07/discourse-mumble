import { withPluginApi } from 'discourse/lib/plugin-api';
import { iconNode } from 'discourse-common/lib/icon-library';
import { h } from 'virtual-dom';
import { ajax } from 'discourse/lib/ajax';

let mumbleIconWidget, mumblePanelWidget, mumbleData;

function countUsers(channel) {
  let count = channel.users.length;
  if ( channel !== mumble_afkchannel ) {
    channel.channels.forEach((chan) => {
      count += countUsers(chan);
    });
  };
  return count;
}

function subscribeMumble() {
  const messageBus = Discourse.__container__.lookup("message-bus:main");

  messageBus.subscribe("/mumble", (result) => {
    if (result.data) {
      mumbleData = result.data;
      rerenderWidgets();
    }
  });
}

function rerenderWidgets() {
  // ugly but works...
  if (mumbleIconWidget) {
    mumbleIconWidget.scheduleRerender();
  }
  if (mumblePanelWidget) {
    mumblePanelWidget.scheduleRerender();
  }  
}

function initMumbleWidget(api) {

  api.createWidget("mumble-icon", {
    tagName: "li.header-dropdown-toggle",

    buildKey(attrs) {
      return "mumble-icon";
    },

    buildClasses(attrs) {
      if (attrs.state.mumbleVisible) { return "active"; };
    },

    html(attrs) {
      const icon = iconNode("headphones");
      const userCount = attrs.data ? countUsers(attrs.data.root) : 0;
      const badge = h('div.badge-notification.mumble-badge', {}, userCount);
      return h('a.icon.btn-flat', {}, [icon, badge]);
    },

    click(e) {
      e.preventDefault();
      const action = this.attrs.state.mumbleVisible ? "hide" : "show";
      this.sendWidgetAction(`${action}Mumble`);
    }
  });

  api.createWidget("mumble-panel", {
    tagName: "div.mumble-panel",

    buildKey(attrs) {
      return "mumble-panel";
    },

    html(attrs) {
      if (attrs.state.mumbleVisible) {
        return this.attach("menu-panel", {
          contents: () => {
            if (attrs.data) {
              const header    = h("div.mumble-panel-header", [iconNode("server"), attrs.data.name]);
              const channels  = this.attach("mumble-channel", {channel: attrs.data.root, root: true});
              return [header, h("hr"), channels];
            }
          }
        });
      }
    },

    clickOutside() {
      this.sendWidgetAction("hideMumble");
    }
  });

  api.createWidget("mumble-channel", {
    tagName: "div.mumble-channel",

    buildClasses(attrs) {
      if (attrs.root) {
        return "root";
      }
    },

    buildKey(attrs) {
      return `mumble-channel-${attrs.channel.id}`;
    },

    defaultState(attrs) {
      return { expanded: (attrs.root ? true : false) };
    },

    html(attrs, state) {
      const caretIcon = state.expanded ? "caret-down" : "caret-right";
      const body      = [h("div.mumble-channel-name", [iconNode(caretIcon), attrs.channel.name])];

      if (state.expanded) {
        const list = [];
        attrs.channel.channels.forEach((channel) => {
          list.push(this.attach("mumble-channel", {channel}));
        });

        attrs.channel.users.forEach((user) => {
          list.push(this.attach("mumble-user", {user}));
        });

        body.push(h("div", list));
      }

      return body;
    },

    click() {
      this.state.expanded = !this.state.expanded;
    }
  });

  api.createWidget("mumble-user", {
    tagName: "div.mumble-user",

    buildKey(attrs) {
      return `mumble-user-${attrs.user.name}`;
    },

    buildClasses(attrs) {
      const idle = attrs.user.idlesecs;
      if (idle && parseInt(idle) > 0) {
        return "idle";
      }
    },

    html(attrs) {
      return h("span", [iconNode("user"), attrs.user.name]);
    }
  });

  api.decorateWidget('header-icons:before', dec => {
    mumbleIconWidget = dec.widget;
    const state = dec.widget.parentWidget.state;
    return dec.attach("mumble-icon", {state, data: mumbleData});
  });

  api.attachWidgetAction("header", "showMumble", function() {
    this.state.mumbleVisible = true;
  });

  api.attachWidgetAction("header", "hideMumble", function() {
    this.state.mumbleVisible = false;
  });

  api.addHeaderPanel("mumble-panel", "mumbleVisible", function(attrs, state) {
    mumblePanelWidget = this;
    return {attrs, state, data: mumbleData};
  });

  ajax("/mumble/list.json").then((result) => {
    if (result.data) {
      mumbleData = result.data;
      rerenderWidgets()
    }
  });

}

export default {
  name: 'extend-for-mumble',
  initialize(container) {
    const siteSettings = container.lookup("site-settings:main");
    if (siteSettings.mumble_enabled) {
      withPluginApi('0.1', initMumbleWidget);
      subscribeMumble();
    }
  }
};