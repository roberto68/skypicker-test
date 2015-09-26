var Col = require('react-bootstrap/lib/Col')
var React = require('react')
var reduxForm = require('redux-form').default
var Row = require('react-bootstrap/lib/Row')
var {connect} = require('react-redux')

var DateInput = require('./DateInput')
var FormField = require('./FormField')
var LoadingButton = require('./LoadingButton')
var StaticField = require('./StaticField')
var TextInput = require('./TextInput')

var {zeroTime} = require('./utils')

var TODAY = zeroTime(new Date())

var mapStateToProps = state => state

var form = reduxForm({
  form: 'addTravel',
  fields: ['startDate', 'endDate', 'origin', 'destination', 'hotel', 'hasCar'],
  touchOnChange: true,
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
      fakeSaving: false
    }
  },
  componentWillMount() {
    this.props.initializeForm({
      startDate: null,
      endDate: null,
      origin: '',
      destination: '',
      hotel: '',
      hasCar: 'no'
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
  handleSubmit(data) {
    this.setState({fakeSaving: true})
    setTimeout(() => this.setState({fakeSaving: false}), 2000)
  },

  render() {
    var {fields} = this.props
    var {fakeSaving} = this.state
    return <div className="AddTravel">
      <p className="lead">
        Enter travel below.
      </p>
      <form className="form-horizontal" onSubmit={this.props.handleSubmit(this.handleSubmit)}>
        <Row>
          <StaticField label="First Name:" value="Steve"/>
          <StaticField label="Last Name:" value="Test"/>
        </Row>
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
          <TextInput
            disabled={fakeSaving}
            field={fields.hotel}
            help="Please enter name of hotel here. If no hotel booking exists or unknown put 'N/A'"
            id="hotel"
            label="Hotel:"
          />
          <FormField help="Please select 'Yes' if access to a car (rented or personal) during travel and 'No' if no access to a car during travel"
                     label="Car:">
            <label className="radio-inline">
              <input type="radio" name="hasCar" value="yes" onChange={fields.hasCar.onChange} disabled={fakeSaving}/> Yes
            </label>
            <label className="radio-inline">
              <input type="radio" name="hasCar" value="no" onChange={fields.hasCar.onChange} defaultChecked disabled={fakeSaving}/> No
            </label>
          </FormField>
        </Row>
        <Row className="form-group">
          <Col sm={12} className="text-center">
            <LoadingButton type="submit" bsSize="large" bsStyle="primary" disabled={fakeSaving}>
              <img src={require('images/add-travel-button.png')}/> Add Travel
            </LoadingButton>
          </Col>
        </Row>
      </form>
    </div>
  }
})

module.exports = connect(mapStateToProps)(form(AddTravel))
