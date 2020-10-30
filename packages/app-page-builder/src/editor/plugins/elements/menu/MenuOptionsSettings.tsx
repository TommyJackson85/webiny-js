import * as React from "react";
import { Grid, Cell } from "@webiny/ui/Grid";
import { LIST_MENUS } from "./graphql";
import { Query } from "react-apollo";
import { Select } from "@webiny/ui/Select";
import { get } from "lodash";
import { getPlugins } from "@webiny/plugins";
import styled from "@emotion/styled";
import { validation } from "@webiny/validation";
import { AutoComplete } from "@webiny/ui/AutoComplete";
import { PbPageElementMenuComponentPlugin } from "@webiny/app-page-builder/types";

const FormOptionsWrapper = styled("div")({
    minHeight: 250
});

//const components = ["Menu Navigation", "Grid Menu"];
const getOptions = ({ gqlData, settingsData }) => {
    const menuID = settingsData?.settings?.menu?.element;
    const selectedComponent = settingsData?.settings?.menu?.component?.componentName;
    
    const components = getPlugins<PbPageElementMenuComponentPlugin>(
        "pb-page-element-menu-component"
    );

    const menusList = gqlData?.pageBuilder?.menus?.data || [];
    
    const menuOptions = menusList.map(({ id, title, slug, description, items, createdOn }) => (
        { id, name: title, slug, items, description, createdOn }
    ));
    
    return {
        menu: {
            options: menuOptions,
            value: menuOptions.find(item => item.id === menuID) || null
        },
        component: {
            options: components,
            value: components.find(item => item.componentName === selectedComponent) || null
        }
    }
};


const MenuOptionsSettings = ({ Bind, data: settingsData }) => {
    return (
        <FormOptionsWrapper>
            <Query query={LIST_MENUS} fetchPolicy="network-only">
                {({ data: gqlData, loading, refetch }) => {
                    if (loading) {
                        return <div>Loading...</div>;
                    }
                    const { menu, component } = getOptions({ gqlData, settingsData });
        
                    return (
                        <Grid>
                            <Cell span={12}>
                                <Bind
                                    name={"settings.menu.element"}
                                    validators={validation.create("required")}
                                >
                                    {({ onChange }) => (
                                        <AutoComplete
                                            options={menu.options}
                                            value={menu.value}
                                            onChange={onChange}
                                            label={"Menu"}
                                        />
                                    )}
                                </Bind>
                            </Cell>
                            <Cell span={12}>
                                <Bind
                                    name={"settings.menu.component"}
                                    defaultValue={null}
                                    validators={validation.create("required")}
                                >
                                    <Select
                                        label={"Component"}
                                        description={"Select a component to render Menu data"}
                                    >
                                        {component.options.map(cmp => (
                                            <option key={cmp.name} value={cmp.componentName}>
                                                {cmp.title}
                                            </option>
                                        ))}
                                    </Select>
                                </Bind>
                            </Cell>
                        </Grid>
                    );
                }}
            </Query>
        </FormOptionsWrapper>
    )
}

export default MenuOptionsSettings;