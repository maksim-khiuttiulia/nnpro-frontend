import React, {Component} from "react";
import {RouteComponentProps, withRouter} from "react-router";
import Loader from "../../loader/Loader";
import {withTranslation, WithTranslation} from "react-i18next";
import ErrorMessage from "../../../common/errormessage/ErrorMessage";
import Report, {ReportStatus} from "../../../../entities/Report";
import {getReport, updateReport} from "../../../../services/ReportService";
import {Col, Nav, Row, Tab} from "react-bootstrap";
import FinishVisitDialog from "../finishvisitdialog/FinishVisitDialog";

interface Props extends RouteComponentProps<MatchParams>, WithTranslation {

}

interface MatchParams {
    id: string;
}

interface State {
    isLoading: boolean,
    isOpenDeleteDialog: boolean
    updateReportOpen : boolean
    report: Report

    isError : boolean,
    errorText? : string
}

class ReportDetails extends Component<Props, State> {

    state: Readonly<State> = {
        isLoading: true,
        isError : false,
        isOpenDeleteDialog: false,
        updateReportOpen : false,
        report: {} as Report
    }

    componentDidMount() {
        this.loadData();
    }

    loadData = () => {
        let id = Number(this.props.match.params.id);
        getReport(id).then(response => {
            this.setState({isLoading: false, report: response})
        }).catch(reason => {
            this.setState({isError : true, isLoading : false});
        })
    }

    private onFinishReport = () : void => {
        let report = this.state.report;
        this.setState({updateReportOpen : true})
    }

    private onFinishReportSubmit = (report : Report) => {
        this.setState({updateReportOpen : false, isLoading : true})
        updateReport(report).then(value => {
            this.loadData();
        }).catch(reason => {
            this.setState({isLoading : false, isError : true})
        })
    }

    private onFinishReportCancel = () => {
        this.setState({updateReportOpen : false})
    }

    render() {
        let t = this.props.t;
        let report: Report = this.state.report;
        if (this.state.isLoading) {
            return <Loader show={true}/>
        }


        let visitDate = new Date(this.state.report.date);

        console.log(visitDate)

        let description = (this.state.report.textDescription) ? this.state.report.textDescription : "Žádné informace";
        let diagnosis = (this.state.report.textDiagnosis) ? this.state.report.textDiagnosis : "Žádné informace";
        let recommendation = (this.state.report.textRecommendation) ? this.state.report.textRecommendation : "Žádné informace";
        let finishButton = this.state.report.reportState === ReportStatus.READY ? <button type="button" className="btn btn-info px-4 mr-2" onClick={this.onFinishReport}>{t("finish")}</button> : ""

        return (
            <div>
                <ErrorMessage show={this.state.isError}/>
                <FinishVisitDialog item={this.state.report} onSubmit={this.onFinishReportSubmit} onCancel={this.onFinishReportCancel} isOpen={this.state.updateReportOpen}/>
                <div className="row mb-5">
                    <div className="col">
                        <h1>Návštěva {this.state.report.animal?.name}</h1>
                        <p></p>
                    </div>
                    <div className="col d-flex justify-content-end align-items-center">
                        {finishButton}
                    </div>
                </div>

                <Tab.Container id="left-tabs-example" defaultActiveKey="description">
                    <Row>
                        <Col sm={12} lg={3}>
                            <h5 className="mt-1 mb-3">Information</h5>
                            <Nav variant="pills" className="flex-column">
                                <Nav.Item>
                                    <Nav.Link eventKey="description">Description</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="diagnosis">Diagnosis</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="recommendation">Recommendation</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Col>
                        <Col sm={12} lg={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="description">
                                    <Row>
                                        <Col><p className="mb-3">{description}</p></Col>
                                    </Row>
                                </Tab.Pane>
                                <Tab.Pane eventKey="diagnosis">
                                    <Row>
                                        <Col><p className="mb-3">{diagnosis}</p></Col>
                                    </Row>
                                </Tab.Pane>
                                <Tab.Pane eventKey="recommendation">
                                    <Row>
                                        <Col><p className="mb-3">{recommendation}</p></Col>
                                    </Row>
                                </Tab.Pane>
                            </Tab.Content>
                        </Col>
                    </Row>
                </Tab.Container>
            </div>
        )
    }
}

export default withTranslation()(withRouter(ReportDetails))
