import React, {Component} from "react";
import {ProgressBar} from "react-bootstrap";

class LoadingComponent extends  Component {

    constructor(props) {
        super(props);
        this.state = {
            busy: this.props.busy,
            numDocs: this.props.numDocs
        };
    }



    render() {
        const numDocs = this.state.numDocs;
        let found;

        if(numDocs > 0) {
            found = <span className="rainbow">{ "Found " + this.state.numDocs }</span>
        } else {
            found = ""
        }

        return(
            <div className="rainbow">
                <ProgressBar striped variant={"secondary"}animated now={45}/>
            </div>
        );
    }

}

export default LoadingComponent;