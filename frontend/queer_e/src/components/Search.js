import React, {Component} from "react";
import {Button, Form, FormControl, InputGroup} from "react-bootstrap";
import ResultCard from "./ResultCard";
import Tree from "./react-animated-tree";
import LoadingComponent from "./LoadingComponent";



const config = open => ({
    from: {height: 0, opacity: 0, transform: 'translate3d(20px,0,0)'},
    to: {
        height: open ? 'auto' : 0,
        opacity: open ? 1 : 0,
        transform: open ? 'translate3d(0px,0,0)' : 'translate3d(20px,0,0)',
    },
})

const treeStyles = {
    color: 'white',
    fill: 'white',
    width: '100%',
    'text-align': 'left'
}


const defaultParams = {
    solrSearchUrl: "http://localhost:8983/solr/nif/select",
    query: "",
    fetchFields: [
        "title",
        "email",
        "id",
        "body",
        "url",
        "category",
        "orientation"
    ],
    filters:[
    ],
    offset: 0,
    limit: 10,
    facet: {
        categories: {
            type: "terms",
            field: "category",
            limit: 10
        },
    },
    highlightParams: {
        "hl": "true",
        "hl.fl": "title author body",
        "hl.snippets": 10,
        "hl.fragsize": 420,
        "defType": "edismax",
        "debugQuery": "true",
        "qf": "title^20 content^3",
        "pf": "title^20 content^3",
        "ps": "5",
        "mlt": "true",
        "mlt.fl": "title body",
        "mlt.count" : "6",

    }
};

// "suggest": "true",
//     "suggest.dictionary": "mySuggester",
//     "suggest.q": "guy",
//     "suggest.count": "3"
//suggestions works, just not included in the UI

const rainbowArray = [
    "r",
    "a",
    "i",
    "n",
    "b",
    "o",
    "w",
    "s"
];

function rainbowfy() {
    let index = Math.floor(Math.random() * Math.floor(7));
    return rainbowArray[index];
}


class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchParams: defaultParams,
            busy: false,
            error: null,
            response: null,
            categories: {},
            orientations: {}
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCategory = this.handleCategory.bind(this);
        this.handleOrientation = this.handleOrientation.bind(this);
        this.resetArgs = this.resetArgs.bind(this);
        this.parseThisNonsense = this.parseThisNonsense.bind(this);
        this.populateFields = this.populateFields.bind(this);

    }


    doSearch(searchParams) {
        console.log("BEFORE SEARCH: ", this.state);
        if (searchParams.query) {
            this.setState({busy: true, error: null, searchParams});
            let params = Object.assign({wt: "json"}, searchParams.highlightParams);
            let solrParams = {
                offset: searchParams.offset,
                limit: searchParams.limit,
                query: searchParams.query,
                filter: searchParams.filter,
                fields: searchParams.fetchFields,
                facet: searchParams.facet,
                sort: searchParams.sort,
                params
            };

            const reqBody = JSON.stringify(solrParams);
            //console.log("Inside", reqBody);
            // do the search. 'post' is required with a fetch() body. Solr doesn't mind
            fetch(searchParams.solrSearchUrl, {
                method: 'post',
                body: reqBody,
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            })
                .then((response) => {
                    console.log("Ok");
                    if (response.ok) {
                        return response.json();
                    } else {
                        // eslint-disable-next-line no-throw-literal
                        throw response.status + " " + response.statusText;
                    }
                })
                .then((response) => {
                    console.log("Got some :", response);
                    this.setState({busy: false, error: null, response});
                })
                .catch((error) => {
                    console.log(error);
                    this.setState({busy: false, error: "" + error, response: null});
                });
        } else {
            // no search to perform
            console.log("no Search");
            this.setState({busy: false, error: null, response: null});
        }
    }

    handleChange(event) {
        let oldParams = this.state.searchParams;
        oldParams.query = event.target.value;
        this.setState({
            searchParams: oldParams
        });
    }

    populateFields() {

        let filters = [];
        Object.keys(this.state.orientations).forEach(e=> {
            if(this.state.orientations[e]) {
                let temp = "orientation:" + e.toLocaleLowerCase();
                filters.push(temp);
            }
        });
        Object.keys(this.state.categories).forEach(e=> {
            if(this.state.categories[e]) {
                let temp ="category:" + e.toLocaleLowerCase().replace("adult", "");
                filters.push(temp);
            }
        });


        let oldParams = this.state.searchParams;
        oldParams.filters = filters;
        this.setState({
            searchParams: oldParams
        });

    }

    handleSubmit(event) {
        //TODO grab all the fields and what not
        this.populateFields();
        console.log(this.state.searchParams.filters);
        this.setState({
            response: null
        });
        this.doSearch(this.state.searchParams);
        event.preventDefault();
    }

    handleCategory(event) {
        let category = event.props.content;
        let categories = this.state.categories;
        categories[category] = !categories[category];
        this.setState({
            categories: categories
        })
    }

    handleOrientation(event) {
        let orientation = event.props.content;
        let orientations = this.state.orientations;
        orientations[orientation] = !orientations[orientation];
        this.setState({
            orientations: orientations
        })
    }

    resetArgs(event) {
        this.setState({
                categories: {},
                orientations: {}
            }
        );
        console.log("Categories reset!");
    }

    parseThisNonsense(response) {
        //debugger;
        let resultCards = "";
        if (response !== null) {
            let highLighting  = response.highlighting;
            let mlt = response.moreLikeThis;
            resultCards = response.response.docs.map((result, i) => {
                let id = result.id;
                return <ResultCard key={i}
                                   title={result.title}
                                   email={result.email}
                                   url={result.url}
                                   category={result.category}
                                   orientation={result.orientation}
                                   body={highLighting[id].body.slice(0,1)}
                                   mlt={mlt[id]}

                />;
            });
        }
        //console.log(resultCards);
        return resultCards;
    }

    render() {

        return (
            <div className="container-fluid fill">
                <div className="row">
                    <div className="col-3">
                        <Tree content="Orientation" type="ASS" canHide style={treeStyles} className={"col"}
                              springConfig={config} onClick={this.resetArgs}>
                            <Tree content={"Gay"} canHide onClick={this.handleOrientation}>
                                <Tree content="Adult Friends" canHide onClick={this.handleCategory}/>
                                <Tree content="Adult Youth" canHide onClick={this.handleCategory}/>
                                <Tree content="Athletics" canHide onClick={this.handleCategory}/>
                                <Tree content="Authoritarian" canHide onClick={this.handleCategory}/>
                                <Tree content="Beginnings" canHide onClick={this.handleCategory}/>
                                <Tree content="Camping" canHide onClick={this.handleCategory}/>
                                <Tree content="Celebrity" canHide onClick={this.handleCategory}/>
                                <Tree content="College" canHide onClick={this.handleCategory}/>
                                <Tree content="Encounters" canHide onClick={this.handleCategory}/>
                                <Tree content="First Time" canHide onClick={this.handleCategory}/>
                                <Tree content="High School" canHide onClick={this.handleCategory}/>
                                <Tree content="Historical" canHide onClick={this.handleCategory}/>
                                <Tree content="Incest" canHide onClick={this.handleCategory}/>
                                <Tree content="Interracial" canHide onClick={this.handleCategory}/>
                                <Tree content="Masturbation" canHide onClick={this.handleCategory}/>
                                <Tree content="Military" canHide onClick={this.handleCategory}/>
                                <Tree content="No Sex" canHide onClick={this.handleCategory}/>
                                <Tree content="Non-English" canHide onClick={this.handleCategory}/>
                                <Tree content="Relationships" canHide onClick={this.handleCategory}/>
                                <Tree content="Rural" canHide onClick={this.handleCategory}/>
                                <Tree content="Science Fiction or Fantasy" canHide onClick={this.handleCategory}/>
                                <Tree content="Urination" canHide onClick={this.handleCategory}/>
                                <Tree content="Young Friends" canHide onClick={this.handleCategory}/>
                            </Tree>
                            <Tree content="Transgender" canHide onClick={this.handleOrientation}>
                                <Tree content="Joe Bates Saga" canHide onClick={this.handleCategory}/>
                                <Tree content="Magic & Science Fiction" canHide onClick={this.handleCategory}/>
                                <Tree content="Non TG-Stories" canHide onClick={this.handleCategory}/>
                                <Tree content="Authoritarian" canHide onClick={this.handleCategory}/>
                                <Tree content="by Authors" canHide onClick={this.handleCategory}/>
                                <Tree content="Chemical" canHide onClick={this.handleCategory}/>
                                <Tree content="College" canHide onClick={this.handleCategory}/>
                                <Tree content="Control" canHide onClick={this.handleCategory}/>
                                <Tree content="Highschool" canHide onClick={this.handleCategory}/>
                                <Tree content="Mind-control" canHide onClick={this.handleCategory}/>
                                <Tree content="She-male" canHide onClick={this.handleCategory}/>
                                <Tree content="Surgery" canHide onClick={this.handleCategory}/>
                                <Tree content="Teen" canHide onClick={this.handleCategory}/>
                                <Tree content="TV" canHide onClick={this.handleCategory}/>
                                <Tree content="Young Friends" canHide onClick={this.handleCategory}/>
                            </Tree>
                            <Tree content={"Bisexual"} canHide onClick={this.handleOrientation}>
                                <Tree content="Adult Friends" canHide onClick={this.handleCategory}/>
                                <Tree content="Adult Youth" canHide onClick={this.handleCategory}/>
                                <Tree content="Athletics" canHide onClick={this.handleCategory}/>
                                <Tree content="Authoritarian" canHide onClick={this.handleCategory}/>
                                <Tree content="Beginnings" canHide onClick={this.handleCategory}/>
                                <Tree content="Camping" canHide onClick={this.handleCategory}/>
                                <Tree content="Celebrity" canHide onClick={this.handleCategory}/>
                                <Tree content="College" canHide onClick={this.handleCategory}/>
                                <Tree content="Encounters" canHide onClick={this.handleCategory}/>
                                <Tree content="High School" canHide onClick={this.handleCategory}/>
                                <Tree content="Historical" canHide onClick={this.handleCategory}/>
                                <Tree content="Incest" canHide onClick={this.handleCategory}/>
                                <Tree content="Interracial" canHide onClick={this.handleCategory}/>
                                <Tree content="Jockey Hollow" canHide onClick={this.handleCategory}/>
                                <Tree content="Masturbation" canHide onClick={this.handleCategory}/>
                                <Tree content="Military" canHide onClick={this.handleCategory}/>
                                <Tree content="Relationships" canHide onClick={this.handleCategory}/>
                                <Tree content="Rural" canHide onClick={this.handleCategory}/>
                                <Tree content="Science Fiction or Fantasy" canHide onClick={this.handleCategory}/>
                                <Tree content="Urination" canHide onClick={this.handleCategory}/>
                                <Tree content="Young Friends" canHide onClick={this.handleCategory}/>
                            </Tree>
                            <Tree content={"Lesbian"} canHide onClick={this.handleOrientation}>
                                <Tree content="Adult Friends" canHide onClick={this.handleCategory}/>
                                <Tree content="Adult Youth" canHide onClick={this.handleCategory}/>
                                <Tree content="Athletics" canHide onClick={this.handleCategory}/>
                                <Tree content="Authoritarian" canHide onClick={this.handleCategory}/>
                                <Tree content="Battle" canHide onClick={this.handleCategory}/>
                                <Tree content="Beginnings" canHide onClick={this.handleCategory}/>
                                <Tree content="Bondage" canHide onClick={this.handleCategory}/>
                                <Tree content="Celebrity" canHide onClick={this.handleCategory}/>
                                <Tree content="College" canHide onClick={this.handleCategory}/>
                                <Tree content="Encounters" canHide onClick={this.handleCategory}/>
                                <Tree content="High School" canHide onClick={this.handleCategory}/>
                                <Tree content="Hookers" canHide onClick={this.handleCategory}/>
                                <Tree content="Incest" canHide onClick={this.handleCategory}/>
                                <Tree content="Interracial" canHide onClick={this.handleCategory}/>
                                <Tree content="Masturbation" canHide onClick={this.handleCategory}/>
                                <Tree content="Miscellaneous" canHide onClick={this.handleCategory}/>
                                <Tree content="Romance" canHide onClick={this.handleCategory}/>
                                <Tree content="Science Fiction or Fantasy" canHide onClick={this.handleCategory}/>
                                <Tree content="Urination" canHide onClick={this.handleCategory}/>
                                <Tree content="Young Friends" canHide onClick={this.handleCategory}/>
                            </Tree>

                        </Tree>
                    </div>
                    <div className="col-9">
                        <div className={"row"}>
                            <Form onSubmit={this.handleSubmit} className="col">
                                <InputGroup className="mb-3">
                                    <FormControl placeholder="enter terms" value={this.state.searchParams.query}
                                                 onChange={this.handleChange}/>
                                    <InputGroup.Append>
                                        <Button className="rainbow"
                                                onSubmit={this.handleSubmit}>Search</Button>
                                    </InputGroup.Append>
                                </InputGroup>
                            </Form>
                        </div>
                        <div className={"row"}>
                            <div className={"col"}>{this.parseThisNonsense(this.state.response)}</div>
                        </div>
                    </div>

                </div>
            </div>

        );
    }

}

export default Search;