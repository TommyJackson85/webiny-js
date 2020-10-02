import React from "react";
import { Form } from "@webiny/form";
import { Grid, Cell } from "@webiny/ui/Grid";
import { Input } from "@webiny/ui/Input";
import { ButtonPrimary } from "@webiny/ui/Button";
import MenuItems from "./MenuItems";
import { CircularProgress } from "@webiny/ui/Progress";
import { useCrud } from "@webiny/app-admin/hooks/useCrud";
import { LIST_MENUS } from "../graphql";
import { Query } from "react-apollo";

import { i18n } from "@webiny/app/i18n";
import { validation } from "@webiny/validation";
import {
    SimpleForm,
    SimpleFormFooter,
    SimpleFormContent
} from "@webiny/app-admin/components/SimpleForm";

const t = i18n.ns("app-page-builder/admin/menus/form");

const MenuTemplate = ({ menu }) => {

    console.log("Menu Template:::::::::::")
    console.log(menu);
    let { id, name: title, slug, description, items, createdOn, loading } = menu;
    /*const props = {
        preview: true,
        parentId: menu,
    };*/
    //const { form: crudForm } = useCrud();
    //fetchPolicy="network-only"
    return (
        <Form {...menu} data={menu.id ? { id, title, slug, description, items, createdOn } : { items: [] }}>
            {({ data, form, Bind }) => (
                <SimpleForm data-testid={"pb-menus-form"}>
                    {loading && <CircularProgress />}
                    <SimpleFormContent>
                        <Grid>
                            <Cell span={6}>
                                <Bind name="title" validators={validation.create("required")}>
                                    <Input label={t`Name`} />
                                </Bind>
                            </Cell>
                            <Cell span={6}>
                                <Bind name="slug" validators={validation.create("required")}>
                                    <Input disabled={data.id} label={t`Slug`} />
                                </Bind>
                            </Cell>
                            <Cell span={12}>
                                <Bind name="description">
                                    <Input rows={5} label={t`Description`} />
                                </Bind>
                            </Cell>
                        </Grid>
                        <Bind name="items">
                            {props => <MenuItems menuForm={form} {...props} />}
                        </Bind>
                    </SimpleFormContent>
                    <SimpleFormFooter>
                        <ButtonPrimary onClick={form.submit}>{t`Save menu`}</ButtonPrimary>
                    </SimpleFormFooter>
                </SimpleForm>
            )}
        </Form>
    );
}
export default MenuTemplate;