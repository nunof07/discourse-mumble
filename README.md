# Mumble plugin for Discourse
A Mumble Viewer plugin for Discourse that displays channel and user information.
- [Discourse] is an open source discussion platform.
- [Mumble] is an open source voice chat software.

The Mumble server needs to support the [Channel Viewer Protocol][cvp]. Most Mumble servers support this. If you manage your own server you can install a [3rd party application][cvpapp] to do this.

[discourse]: http://www.discourse.org/
[mumble]: http://wiki.mumble.info/wiki/Main_Page
[cvp]: http://wiki.mumble.info/wiki/Channel_Viewer_Protocol
[cvpapp]: http://wiki.mumble.info/wiki/3rd_Party_Applications#Channel_Viewers

## How to install
Follow the guide on how to [Install a Plugin][plugin] for Discourse but add this repository URL instead.

Then go to Admin > Plugins and choose Mumble settings:
- *mumble_interval*: the interval between information refreshes
- *mumble_cvp*: the URL to the [Channel Viewer Protocol][cvp] service
- *mumble_xml*: whether the URL to the CVP service is for XML, otherwise will use JSON

[plugin]: https://meta.discourse.org/t/install-a-plugin/19157
