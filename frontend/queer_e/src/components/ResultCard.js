import React, {Component} from "react";
import {Card} from "react-bootstrap";


function convertEmoji(str) {

    return str.replace(/\[e-([0-9a-fA-F]+)\]/g, (match, hex) =>
        String.fromCodePoint(Number.parseInt(hex, 16))
    );
}

console.log(convertEmoji('[e-1f60e]')); // 😎



function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

export default class ResultCard extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: props.title,
            url: props.url,
            category: props.category,
            email: props.email,
            orientation: props.orientation,
            body: props.body,
            mlt: props.mlt
        };
    }



    render(){
        let snippetSections ="";
        if(this.state.body !== null) {
             snippetSections = this.state.body.map((result, i) => {
                return <Card.Text key={i} dangerouslySetInnerHTML={{__html: "\"" + result + "\""}}/> ;
            });
        }

        let moreLikeThis = "";
        //console.log(this.state.mlt);
        if(this.state.mlt) {
            moreLikeThis = this.state.mlt.docs.map((moreDoc, j)=> {
                //console.log(this.state.mlt);
                return <Card.Link key={j} href={"http://" + moreDoc.url}> {moreDoc.title} </Card.Link>
            })
        }


        return(

            <Card className= "text-left p-4 mb-4">
                <Card.Title>{
                    <a href={"http://"+this.state.url} >{
                    toTitleCase(this.state.title.replace(/-/g, " "))}
                    </a> }
                </Card.Title>
                <Card.Subtitle className={"mb-1"}> {"By " } <a href={"mailto:"+ this.state.email}>{this.state.email}</a> </Card.Subtitle>
                <div>
                    <h6 className={"mb-3"}>{toTitleCase(this.state.orientation + " : " + this.state.category)} </h6>
                    </div>
                {snippetSections}
                <Card.Footer>
                    <p> <em>Liked those, try these...</em> </p>
                    {moreLikeThis}
                </Card.Footer>
            </Card>
        );
    };



}