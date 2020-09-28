import * as React from "react";
import { Grid, Cell } from "@webiny/ui/Grid";
import { Input } from "@webiny/ui/Input";
import { Select } from "@webiny/ui/Select";
import Menu from "./Menu";
import { LIST_MENUS } from "./graphql";
import { Query } from "react-apollo";
import { get } from "lodash";
import styled from "@emotion/styled";
import { getPlugins } from "@webiny/plugins";
import { validation } from "@webiny/validation";
import { PbPageElementMenuComponentPlugin } from "@webiny/app-page-builder/types";
import { AutoComplete } from "@webiny/ui/AutoComplete";
import { isTerminating } from "apollo-link/lib/linkUtils";

const FormOptionsWrapper = styled("div")({
    minHeight: 250
});

const getOptions = ({ gqlData, settingsData }) => {
    console.log("GETTING OPTIONS::::::::");
    console.log(gqlData);
    console.log(settingsData);
    const output = {
        parents: {
            options: [],
            value: null
        }
    };

    const selected = {
        menus: get(settingsData, "settings.menu.element") || []
    };
    console.log(selected.menus);
    //parentsList currently not working.
    const menusList = get(gqlData, "pageBuilder.menus.data") || [];
    console.log(menusList);
    //const menus = get(data, "pageBuilder.menus");
    console.log("OUTPUT::::::::::");

    //changed title to name to pick up data with auto complete.
    output.parents.options = menusList.map(({ id, title }) => ({ id, name: title }));
    output.parents.value = output.parents.options.find(item => item.id === selected.menus) || null;    //const parent = parentsList.find(item => item.parent === selected.parent);
    console.log(output.parents.value);
    console.log(output.parents.options);
    console.log(selected.menus);

    return output;
};


const MenuDesignSettings = ({ Bind, data: settingsData }) => {
    
    const components = getPlugins<PbPageElementMenuComponentPlugin>(
        "pb-page-element-menu-component"
    );
    console.log("MenuDesignSettings Bind data components:::::::");
    console.log(Bind);
    console.log(settingsData);
    //console.log(components);

    return (
        <FormOptionsWrapper>
            <Query query={LIST_MENUS} fetchPolicy="network-only">
                {({ data: gqlData, loading, refetch }) => {
                    if (loading) {
                        return <div>Loading...</div>;
                    }
                    console.log("gqlResponse   options value:::::::s:::::");
                    console.log(gqlData);
                    //console.log(settingsData);
                    //WORK FROM HERE.. SECOND DATA DROM INITIAL
                    const options = getOptions({ gqlData, settingsData });
                    console.log(options);
                    return (
                        <Grid>
                            <Cell span={12}>
                                <Bind
                                    name={"settings.menu.element"}
                                    validators={validation.create("required")}
                                >
                                    {({ onChange }) => (
                                        <AutoComplete
                                            options={options.parents.options}
                                            value={options.parents.value}
                                            onChange={onChange}
                                            label={"Menu"}
                                        />
                                    )}
                                </Bind>
                            </Cell>
                        </Grid>
                    );
                }}
            </Query>
        </FormOptionsWrapper>
    )

    /*
                    <Cell span={6}>
                    <Bind name={"resultsPerPage"} validators={validation.create("numeric")}>
                        <Input label={"Results per page"} />
                    </Bind>
                </Cell>*/

    /*return (
        <React.Fragment>
            <Grid>
                <Cell span={12}>
                    <Bind
                        name={"component"}
                        defaultValue={components[0] ? components[0].componentName : null}
                    >
                        <Select
                            label={"Design"}
                            description={"Select a component to render the list"}
                        >
                            {components.map(cmp => (
                                <option key={cmp.name} value={cmp.componentName}>
                                    TITLE: {cmp.title} ~ NAME: {cmp.name} ~ COMPONENT NAME: {cmp.componentName}
                                </option>
                            ))}
                        </Select>
                    </Bind>
                </Cell>
            </Grid>

            <Grid>
                <Cell span={12} style={{ overflowY: "scroll" }}>
                    <Menu data={data} />
                </Cell>
            </Grid>
        </React.Fragment>
    );*/
}

export default MenuDesignSettings;
