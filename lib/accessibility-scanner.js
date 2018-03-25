'use babel';

import AccessibilityScannerView from './accessibility-scanner-view';
import { CompositeDisposable } from 'atom';

export default {

  accessibilityScannerView: null,
  modalPanel: null,
  subscriptions: null,

  // config: {
  //   "firstSetting": {
  //     "description": "here"
  //     "type": "string or boolean or what"
  //     "default": "yo"
  //   }
  // }

  activate(state) {
    this.accessibilityScannerView = new AccessibilityScannerView(state.accessibilityScannerViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.accessibilityScannerView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'accessibility-scanner:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.accessibilityScannerView.destroy();
  },

  serialize() {
    return {
      accessibilityScannerViewState: this.accessibilityScannerView.serialize()
    };
  },

  toggle() {
    console.log('AccessibilityScanner was toggled!');
    var editor = atom.workspace.getActiveTextEditor();
    var text = editor.getText();
    var splitText = text.split("\n");
    for(var i = 0; i < splitText.length; i++) {
      var line = splitText[i];
      var start = 0;
      var end = line.length + 1;

      var imgElement = line.search("<img");
      if(imgElement !== -1) {
        // img tag in the line
      }

      var anchorElement = line.search("<a");
      if(anchorElement !== -1) {
        // anchor element in the line
      }

      var textElement = line.search('>"');
      if(textElement !== -1) {
        start = textElement + 1;
      }
    }
    // return (
    //   this.modalPanel.isVisible() ?
    //   this.modalPanel.hide() :
    //   this.modalPanel.show()
    // );
  }

};
