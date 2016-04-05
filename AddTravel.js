var Col = require('react-bootstrap/lib/Col')
var PageHeader = require('react-bootstrap/lib/PageHeader')
var React = require('react')
var Row = require('react-bootstrap/lib/Row')
var {connect} = require('react-redux')
var {reduxForm} = require('redux-form')

var DateInput = require('./DateInput')
var FormField = require('./FormField')
var TextInput = require('./TextInput')

function zeroTime(date) {
  date.setHours(0, 0, 0, 0)
  return date
}
var TODAY = zeroTime(new Date())

var mapStateToProps = state => state

var form = reduxForm({
  form: 'addTravel',
  fields: ['startDate', 'endDate', 'origin', 'destination',  'transfer'],
  touchOnChange: true, // react-widgets DateTimePicker doesn't blur
  validate(travel) {
    var errors = {}
    if (!travel.startDate) errors.startDate = 'Please enter a start date.'
    if (!travel.endDate) errors.endDate = 'Please enter an end date.'
    if (travel.startDate && travel.endDate &&
        zeroTime(travel.endDate) < zeroTime(travel.startDate)) {
      errors.endDate = 'End date must not be earlier than start date.'
    }
    if (!travel.origin) errors.origin = 'Please enter an origin.'
    if (!travel.destination) errors.destination = 'Please enter a destination.'
    return errors
  }
})

var AddTravel = React.createClass({
  getInitialState() {
    return {
      fakeSaving: false,
      fakeSubmitted: null
    }
  },
  componentWillMount() {
    this.props.initializeForm({
      startDate: null,
      endDate: null,
      origin: '',
      destination: '',
      transfer: ''
    })
  },

  /**
   * Set endDate to startDate if it's blank or would otherwise be invalid.
   */
  handleStartDateChange(startDate) {
    var {endDate} = this.props.fields
    if (endDate.value == null || endDate.value < startDate) {
      endDate.onChange(startDate)
    }
  },
  handleSubmit(data) { // handle real flight search !!!!1
    this.setState({fakeSaving: true, fakeSubmitted: data})
    setTimeout(() => this.setState({fakeSaving: false}), 2000)
  },

  render() {
    var {fields} = this.props
    var {fakeSaving, fakeSubmitted} = this.state
    return <div className="container">
      <PageHeader>Skypicker - search your flight</PageHeader>
      <form className="form-horizontal" onSubmit={this.props.handleSubmit(this.handleSubmit)}>
        <Row>
          <DateInput
            afterChange={this.handleStartDateChange}
            disabled={fakeSaving}
            field={fields.startDate}
            id="startDate"
            label="Start Date:"
            min={TODAY}
          />
          <DateInput
            disabled={fakeSaving}
            field={fields.endDate}
            id="endDate"
            label="End Date:"
            min={fields.startDate.value || TODAY}
          />
        </Row>
        <Row>
          <TextInput
            disabled={fakeSaving}
            field={fields.origin}
            id="origin"
            label="Origin:"
          />
          <TextInput
            disabled={fakeSaving}
            field={fields.destination}
            label="Destination:"
            id="destination"
          />
        </Row>
        <Row>
          <FormField help="do you want direct or transfer flight?"
                     label="Transfer:">
            <label className="radio-inline">
              <input type="radio" name="transfer" value="yes" onChange={fields.transfer.onChange} disabled={fakeSaving}/> Yes
            </label>
            <label className="radio-inline">
              <input type="radio" name="transfer" value="no" onChange={fields.transfer.onChange} defaultChecked disabled={fakeSaving}/> No
            </label>
          </FormField>
        </Row>
        <Row className="form-group">
          <Col sm={12} className="text-center">
            
          </Col>
        </Row>
        {fakeSubmitted && <pre><code>{JSON.stringify(fakeSubmitted, null, 2)}</code></pre>}
      </form>
    </div>
  }
})

module.exports = connect(mapStateToProps)(form(AddTravel))
