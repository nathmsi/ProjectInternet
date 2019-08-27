import React, { Component } from 'react'
import { withRouter } from 'react-router-dom';
import { withAlert } from 'react-alert'


class AddComputer extends Component {

    state = {
        name: '',
        image: '',
        price: '',
        brand: '',
        cpu: '',
        sizeScreen: '',
        OperatingSystem: '',
        capacity: '',
        MemorySize: '',
        count: ''
    }

    requireImage = () => {
        return require(`../img/default.jpg`)
    }

    handleChange = event => {
        const { name, value } = event.target
        this.setState({ [name]: value })
    }

    handleSubmit = event => {
        event.preventDefault()
        const computer = { ...this.state }
        if (
            computer.name !== '' &&
            computer.price !== '' &&
            computer.brand !== '' &&
            computer.cpu !== '' &&
            computer.sizeScreen !== '' &&
            computer.OperatingSystem !== '' &&
            computer.capacity !== '' &&
            computer.MemorySize !== '' &&
            computer.count
        ) {
            this.props.AddComputer(computer)
            // Reset
            Object.keys(computer).forEach(item => {
                computer[item] = ''
            })
            this.setState({ ...computer })
        } else {
            this.props.alert.error('Missing field to add computer')
        }

    }

    render() {
        return (
            <div className='card'>
                <br />
                <div className='text-center'>
                    <img src={this.requireImage()} alt={'default'} width="400" height="400" />
                </div>
                <form className='' onSubmit={this.handleSubmit}>
                    <input name='name' type='text' className="form-control"
                        value={this.state.name}
                        placeholder='Name of the computer'
                        onChange={this.handleChange} />
                    <input name='price' rows='2' className="form-control"
                        placeholder='The price'
                        value={this.state.price}
                        onChange={this.handleChange}>
                    </input>
                    <input name='brand' rows='15' className="form-control"
                        placeholder='brand'
                        value={this.state.brand}
                        onChange={this.handleChange}>
                    </input>
                    <input name='cpu' rows='15' className="form-control"
                        placeholder='cpu'
                        value={this.state.cpu}
                        onChange={this.handleChange}>
                    </input>
                    <input name='sizeScreen' rows='15' className="form-control"
                        placeholder='sizeScreen'
                        value={this.state.sizeScreen}
                        onChange={this.handleChange}>
                    </input>
                    <input name='OperatingSystem' rows='15' className="form-control"
                        placeholder='OperatingSystem'
                        value={this.state.OperatingSystem}
                        onChange={this.handleChange}>
                    </input>
                    <input name='capacity' rows='15' className="form-control"
                        placeholder='capacity'
                        value={this.state.capacity}
                        onChange={this.handleChange}>
                    </input>
                    <input name='MemorySize' rows='15' className="form-control"
                        placeholder='MemorySize'
                        value={this.state.MemorySize}
                        onChange={this.handleChange}>
                    </input>
                    <input name='count' rows='15' className="form-control"
                        placeholder='count'
                        value={this.state.count}
                        onChange={this.handleChange}>
                    </input>

                </form>
                <button type='submit' onClick={this.handleSubmit} className='btn btn-primary  btn-lg btn-block' ><font color="white">+ Add a new COMPUTER </font></button>
            </div>
        )
    }
}

export default withRouter(
    withAlert()(AddComputer)
  )
  