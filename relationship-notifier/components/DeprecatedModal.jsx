const { FormTitle, Icon, Tooltip } = require('powercord/components');
const { React, getModule } = require('powercord/webpack');
const { Modal } = require('powercord/components/modal');
const { close } = require('powercord/modal');

const { createToast } = getModule(['createToast'], false);
const { showToast } = getModule(['showToast'], false);
const Markdown = getModule(['rules'], false);

const Loading = require('./Loading.jsx');
const path = require('path');
const fs = require('fs');

module.exports = class extends React.Component {
   constructor() {
      super();

      this.state = {
         failed: false,
         downloading: false
      };
   }

   render() {
      const segments = new URL(this.props.url).pathname.split('/');
      const name = segments.pop() || segments.pop();
      const promptDownload = !this.state.downloading && !this.state.failed;

      return (
         <Modal>
            <Modal.Header className='deprecated-modal-header'>
               <Icon className='deprecated-modal-icon' name='WarningCircle' />
               <FormTitle tag='h4'>
                  Deprecation Notice
               </FormTitle>
               <Modal.CloseButton onClick={close} />
            </Modal.Header>
            <Modal.Content>
               <Markdown>
                  {`**${this.props.name}** has been deprecated in favor of ${this.props.url}.\n\nWould you like **${this.props.name}** to automatically be replaced with **${name}**?`}
               </Markdown>
            </Modal.Content>
            <Modal.Footer className='deprecated-modal-footer'>
               {this.state.failed &&
                  <Tooltip text='Failed to download' hideOnClick={false}>
                     <Icon
                        className='deprecated-modal-failed'
                        name='Close'
                     />
                  </Tooltip>
               }
               {promptDownload &&
                  <Tooltip text='Download' hideOnClick={false}>
                     <Icon
                        className='deprecated-modal-download'
                        name='Download'
                        onClick={this.download.bind(this, name)}
                     />
                  </Tooltip>
               }
               {this.state.downloading &&
                  <Tooltip text='Downloading...' hideOnClick={false}>
                     <Loading className='deprecated-modal-downloading' />
                  </Tooltip>
               }
            </Modal.Footer>
         </Modal>
      );
   }

   download(name) {
      this.setState({ downloading: true });

      const childProcess = { exec: null };
      try {
         childProcess.exec = require('child_process').exec;
      } catch {
         try {
            childProcess.exec = PCCompatNative.executeJS('require("child_process")').exec;
         } catch {
            this.setState({ failed: true });
         }
      }

      const plugins = path.resolve(__dirname, '..', '..');
      try {
         childProcess.exec(`git clone ${this.props.url}`, { cwd: plugins }, (err) => {
            if (err) {
               return this.setState({ failed: true, downloading: false });
            }

            try {
               const manager = powercord.pluginManager;
               (manager.loadAll ?? manager.startPlugins).apply(manager, [true]);

               powercord.pluginManager.disable(this.props.name);
               this.setState({ downloading: false, failed: false });
               
               close();
               showToast(createToast(`Successfully downloaded ${name}`, 1));
            } catch (e) {
               console.error(e);
               this.setState({ failed: true, downloading: false });
            }
         });
      } catch {
         this.setState({ failed: true, downloading: false });
      }
   }
};