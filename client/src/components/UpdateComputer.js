import React, { Component } from "react";
import Modal from './modal/ModalConfirmationUpdate';


class UpdateCar extends Component {


    state = {
        id: '',
        name: '',
        image: '',
        price: '',
        brand: '',
        cpu: '',
        sizeScreen: '',
        OperatingSystem: '',
        capacity: '',
        MemorySize: '',
        isShowing: false,
    }

    componentDidMount() {
        const { computer } = this.props
        this.setState(
            {
                id: computer._id || '',
                name: computer.name || '',
                image: computer.image || '',
                price: computer.price || '',
                brand: computer.brand || '',
                cpu: computer.cpu || '',
                sizeScreen: computer.sizeScreen || '',
                OperatingSystem: computer.OperatingSystem || '',
                capacity: computer.capacity || '',
                MemorySize: computer.MemorySize || '',
            }
        )

    }


    requireImage = chemin => {
        try {
            return require(`../img/${chemin}`)
        } catch (err) {
            return require(`../img/default.jpg`)
        }
    }

    updateComputers = () => {
        const car = { ...this.state }
        this.props.updateComputers(car)
    }

    handleChange = (e) => {
        const { name, value } = e.target
        switch (name) {
            case 'name':
                this.setState({ name: value });
                break;
            case 'price':
                this.setState({ price: value });
                break;
            case 'brand':
                this.setState({ brand: value });
                break;
            case 'cpu':
                this.setState({ cpu: value });
                break;
            case 'sizeScreen':
                this.setState({ sizeScreen: value });
                break;
            case 'OperatingSystem':
                this.setState({ OperatingSystem: value });
                break;
            case 'capacity':
                this.setState({ capacity: value });
                break;
            case 'MemorySize':
                this.setState({ MemorySize: value });
                break;
            default:
        }
        // this.updateCar()   
    }

    openModalHandler = () => {
        this.setState({
            isShowing: true
        });
    }

    closeModalHandler = () => {
        this.setState({
            isShowing: false
        });
    }

    updateComputersConfirmation = () =>{
        this.closeModalHandler()
        this.updateComputers()
    }

    render() {

        const {
            id,
            name,
            image,
            price,
            brand,
            cpu,
            sizeScreen,
            OperatingSystem,
            capacity,
            MemorySize,
        } = this.state
        return (
            <div className='card'>
                <br/>
                <div className='text-center'>
                    <img src={this.requireImage(image)} alt={name} width="400" height="200" />
                </div>

                

                <div className="input-group"><div></div>
                    <h4 className="input-group-addon">Name :</h4>
                    <input type='text' value={name} name='name' className="form-control"
                        onChange={e => this.handleChange(e, 'name')} />
                </div>

                <div className="input-group">
                    <h4 className="input-group-addon">price  :</h4>
                    <input type='text' value={price} name='price' className="form-control"
                        onChange={e => this.handleChange(e, 'price')} />
                </div>

                <div className="input-group">
                    <h4 className="input-group-addon">brand :</h4>
                    <input type='text' value={brand} name='brand' className="form-control"
                        onChange={e => this.handleChange(e, 'brand')} />
                </div>

                <div className="input-group">
                    <h4 className="input-group-addon">cpu   :</h4>
                    <input type='text' value={cpu} name='cpu' className="form-control"
                        onChange={e => this.handleChange(e, 'cpu')} />
                </div>

                <div className="input-group">
                    <h4 className="input-group-addon">sizeScreen :</h4>
                    <input type='text' value={sizeScreen} name='sizeScreen' className="form-control"
                        onChange={e => this.handleChange(e, 'sizeScreen')} />
                </div>

                <div className="input-group">
                    <h4 className="input-group-addon">OperatingSystem  :</h4>
                    <input type='text' value={OperatingSystem} name='OperatingSystem' className="form-control"
                        onChange={e => this.handleChange(e, 'OperatingSystem')} />
                </div>


                <div className="input-group">
                    <h4 className="input-group-addon">capacity :</h4>
                    <input type='text' value={capacity} name='capacity' className="form-control"
                        onChange={e => this.handleChange(e, 'capacity')} />
                </div>

                <div className="input-group">
                    <h4 className="input-group-addon">MemorySize :</h4>
                    <input type='text' value={MemorySize} name='MemorySize' className="form-control"
                        onChange={e => this.handleChange(e, 'MemorySize')} />
                </div>




                <button onClick={this.openModalHandler}
                className='btn btn-warning  btn-lg btn-block' ><font color="white">Updtate</font></button>
                <button onClick={() => this.props.removeComputers(id)}
                className='btn btn-danger btn-lg btn-block' ><font color="white">Delete</font></button>

                <Modal
                    className="modal"
                    show={this.state.isShowing}
                    close={this.closeModalHandler}
                    updateComputersConfirmation = {this.updateComputersConfirmation}   
                    > 
                </Modal>
            </div>
        )
    }

}



export default UpdateCar