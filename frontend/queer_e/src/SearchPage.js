import React from "react";

const SearchPage = () => {
    return (
        <InputGroup size="lg">
            <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-lg">Large</InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl aria-label="Large" aria-describedby="inputGroup-sizing-sm" />
        </InputGroup>

    );
}

export default SearchPage;