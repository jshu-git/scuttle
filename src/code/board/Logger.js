import React from "react";
import AutoScroll from "@brianmcallister/react-auto-scroll";

import "./board.scss";

export class Logger extends React.Component {
    render() {
        // props
        let logger = this.props.logger;

        let cells = [];
        for (let i = 0; i < logger.length; i++) {
            cells.push(<p key={i}>{logger[i]}</p>);
        }

        return (
            <React.Fragment>
                <AutoScroll
                    showOption={false}
                    height={"5rem"}
                    scrollBehavior={"smooth"}
                    className="border"
                >
                    {cells}
                </AutoScroll>
            </React.Fragment>
        );
    }
}
