import React from "react";
import AutoScroll from "@brianmcallister/react-auto-scroll";

import "./board.scss";

export const Logger = (props) => {
    const { G } = props;

    let cells = [];
    for (let i = 0; i < G.logger.length; i++) {
        cells.push(<p key={i}>{G.logger[i]}</p>);
    }

    return (
        <AutoScroll
            showOption={false}
            height={"5rem"}
            scrollBehavior={"smooth"}
            className="border"
        >
            {cells}
        </AutoScroll>
    );
};
