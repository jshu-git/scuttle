import React from "react";

// components
import { Field } from "./Field";
import { SpecialField } from "./SpecialField";

import "./board.scss";
import { Row, Col } from "react-bootstrap";

export const Fields = (props) => {
    const { playerIDOpponent } = props;

    return (
        <React.Fragment>
            {/* opponent player fields */}
            <Row>
                <Col>
                    <h6>Opponent Field</h6>
                    <Row xs={2} sm={2} md={3}>
                        <Field {...props} playerID={playerIDOpponent} />
                    </Row>
                </Col>
                <Col>
                    <h6>Opponent Special Field</h6>
                    <Row xs={2} sm={2} md={3}>
                        <SpecialField {...props} playerID={playerIDOpponent} />
                    </Row>
                </Col>
            </Row>

            <hr></hr>

            {/* player fields */}
            <Row>
                <Col>
                    <h6>Your Field</h6>
                    <Row xs={2} sm={2} md={3}>
                        <Field {...props} />
                    </Row>
                </Col>
                <Col>
                    <h6>Your Special Field</h6>
                    <Row xs={2} sm={2} md={3}>
                        <SpecialField {...props} />
                    </Row>
                </Col>
            </Row>
        </React.Fragment>
    );
};
