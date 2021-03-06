import React, {ReactNode} from "react";
import ClinicListItem from "./ClinicListItem";
import Loader from "../../loader/Loader";
import Clinic from "../../../../entities/Clinic";
import {getClinics, saveNewClinic} from "../../../../services/ClinicService";
import ErrorMessage from "../../../common/errormessage/ErrorMessage";
import AddEditClinicDialog from "../addeditclinicdialog/AddEditClinicDialog";
import {WithTranslation, withTranslation} from "react-i18next";
import { Col, Row } from "react-bootstrap";
import Securable from "../../../common/secureable/Securable";
import {UserRole} from "../../../../entities/User";

interface Props extends WithTranslation{

}

interface State {
    clinics : Clinic[]

    addNewClinicOpen : boolean

    isLoading : boolean
    isError : boolean
}



class ClinicList extends React.Component<Props, State> {
    state : Readonly<State> = {
        clinics : [],

        addNewClinicOpen : false,
        isLoading : false,
        isError : false,
    }

    componentDidMount() {
        this.loadClinics();
    }

    loadClinics = () : void => {
        this.setState({isLoading : true})
        getClinics().then(value => {
            this.setState({clinics : value, isLoading : false});
        }).catch(reason =>{
            this.setState({isLoading : false, isError : true, })
        })
    }

    onAddNewClinic = () : void => {
        this.setState({addNewClinicOpen : true})
    }

    onAddNewClinicSubmit = (clinic : Clinic) => {
        this.setState({addNewClinicOpen : false, isLoading : true})
        saveNewClinic(clinic).then(value => {
            this.loadClinics();
        }).catch(reason => {
            this.setState({isLoading : false, isError : true})
        })
    }

    onAddNewClinicCancel = () => {
        this.setState({addNewClinicOpen : false})
    }

    loadClinicData = (clinic_id : number) => {
        return clinic_id;
    }

    _renderClinicsList = () : ReactNode => {
        let elements : ReactNode[] = this.state.clinics.map(clinic => {
            
            return <ClinicListItem 
                clinic={clinic} 
                key={clinic.idClinic}/>
        })

        return (
            <Row>
                <Col>
                    {elements}
                </Col>
            </Row>
        )
    }

    render() {
        let t = this.props.t
        return (
            <div>
                <Loader show={this.state.isLoading}/>
                <ErrorMessage show={this.state.isError}/>
                <AddEditClinicDialog onSubmit={this.onAddNewClinicSubmit} onCancel={this.onAddNewClinicCancel} isOpen={this.state.addNewClinicOpen}/>
                <div className="row mb-5">
                    <div className="col">
                        <h1>{t("cpHeader")}</h1>
                    </div>
                    <div className="col d-flex justify-content-end align-items-center">
                        <Securable access={[UserRole.ADMINISTRATOR]}>
                            <button type="button" className="btn btn-success px-4" onClick={this.onAddNewClinic}>{t("add")}</button>
                        </Securable>
                    </div>
                </div>
                {this._renderClinicsList()}
            </div>
        );
    }
}

export default withTranslation()(ClinicList)