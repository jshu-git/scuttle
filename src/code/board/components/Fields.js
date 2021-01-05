import React from "react";

// components
import Field from "./Field";
import SpecialField from "./SpecialField";

import "../board.scss";
import { Row, Col } from "react-bootstrap";

const Fields = (props) => {
    const { G, playerID, playerIDOpponent } = props;
    const player = G.players[playerID];
    const opponent = G.players[playerIDOpponent];

    return (
        <React.Fragment>
            {/* opponent player fields */}
            <Row>
                <Col>
                    <h6>Opponent Field</h6>
                    <Row xs={2} sm={2} md={3}>
                        <Field {...props} field={opponent.field} />
                    </Row>
                </Col>
                <Col>
                    <h6>Opponent Special Field</h6>
                    <Row xs={2} sm={2} md={3}>
                        <SpecialField
                            {...props}
                            specialField={opponent.specialField}
                        />
                    </Row>
                </Col>
            </Row>

            <hr></hr>

            {/* player fields */}
            <Row>
                <Col>
                    <h6>Your Field</h6>
                    <Row xs={2} sm={2} md={3}>
                        <Field {...props} field={player.field} />
                    </Row>
                </Col>
                <Col>
                    <h6>Your Special Field</h6>
                    <Row xs={2} sm={2} md={3}>
                        <SpecialField
                            {...props}
                            specialField={player.specialField}
                        />
                    </Row>
                </Col>
            </Row>
        </React.Fragment>
    );
};
export default Fields;
