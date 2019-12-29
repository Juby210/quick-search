const { React } = require('powercord/webpack')
const { SwitchItem, TextInput } = require('powercord/components/settings')

module.exports = class Settings extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}
        this.maxResultsOnChange = val => {
            if(val.length == 0 || isNaN(val)) {
                this.setState({ err: true })
            } else {
                this.setState({ err: false })
    
                this.props.updateSetting('maxResults', Number(val))
            }
        }
    }
    
    render() {
        return (<div>
            <TextInput defaultValue={this.props.getSetting('maxResults', 3)}
            style={this.state.err ? { borderColor: '#f04747' } : {}}
            note={this.state.err ? (<span style={{ color: '#f04747' }}>Must be number</span>) : ''}
            onChange={this.maxResultsOnChange}>
                Max results
            </TextInput>
            <SwitchItem value={this.props.getSetting('showInstantAnswear')}
            onChange={() => this.props.toggleSetting('showInstantAnswear')}>
                Show "instant answear"
            </SwitchItem>
            <SwitchItem value={this.props.getSetting('showSearchInBrowser')}
            onChange={() => this.props.toggleSetting('showSearchInBrowser')}>
                Show search in browser
            </SwitchItem>
        </div>)
    }
}
