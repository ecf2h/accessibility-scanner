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
    var actionWords = ["login", "signin", "me", "this", "here", "quit", "clickhere", "press", "try", "go", "home", "menu", "enter", "expand", "collapse", "edit"];

    for(var i = 0; i < splitText.length; i++) {
      var line = splitText[i];
      var start = 0;
      var end = 0;
      var s = "";

      var imgElement = line.search("<img");
      if(imgElement !== -1) {
        start = imgElement;
        end = line.search(">");
        s = line.substring(start, end);
        if( (s.search('alt=""') !== -1) || (s.search("alt=''") !== -1) ) {
          // empty alt attribute
        }
        else if(s.search("alt=") !== -1) {
          // has filled alt attribute
        }
        else if(s.search("alt") !== -1) {
          // has empty alt attribute
        }
        else if(s.search("title") !== -1) {
          // has title but no alt
        }
        else {
          // throw error - no alt or title
        }
      }

      var anchorElement = line.search("<a");
      if(anchorElement !== -1) {
        start = anchorElement;
        end = line.search(">");
        s = line.substring(start, end);
        if(s.search('class="button"') !== -1) {
          // error - button class but anchor element
        }
        if(s.search('href="#') !== -1) {
          // check to make sure that this redirects to another portion of the page and doesn't have button functionality
        }
      }

      var smushedLine = line.replace(/\s+/g, '');
      if(smushedLine.search('>"') !== -1) {
        // has text in it
        for(var j = 0; j < actionWords.length; j++) {
          if(smushedLine.search(actionWords[j]) !== -1) {
            // has action actionWords
            if( (smushedLine.search("<a") !== -1) && (smushedLine.search("href=") == -1) ) {
              // is anchor element and doesn't have href
            }
            else {
              // is text element with action words
            }
          }
        }
      }
    }
    // return (
    //   this.modalPanel.isVisible() ?
    //   this.modalPanel.hide() :
    //   this.modalPanel.show()
    // );
  }

};
