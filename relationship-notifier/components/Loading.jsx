const { React } = require('powercord/webpack');

module.exports = React.memo((props) => <div
   className={`deprecated-modal-downloading ${props.className ?? ''}`}
/>);