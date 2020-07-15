import { t } from "ttag";
import { updateIn } from "icepick";

import {
  PLUGIN_AUTH_PROVIDERS,
  PLUGIN_ADMIN_SETTINGS_UPDATES,
} from "metabase/plugins";

import MetabaseSettings from "metabase/lib/settings";

// import GoogleButton from "metabase/auth/components/GoogleButton";

import AuthenticationOption from "metabase/admin/settings/components/widgets/AuthenticationOption";
import SettingsGoogleIdentityForm
  from "metabase/admin/settings/components/SettingsGoogleIdentityForm";

const GOOGLE_IDENTITY_PROVIDER = {
  name: "google_identity",
  // Button: GoogleButton,
};

PLUGIN_AUTH_PROVIDERS.push(providers =>
  MetabaseSettings.googleIdentityEnabled()
    ? [GOOGLE_IDENTITY_PROVIDER, ...providers]
    : providers,
);

PLUGIN_ADMIN_SETTINGS_UPDATES.push(sections =>
  updateIn(sections, ["authentication", "settings"], settings => [
    ...settings,
    {
      authName: t`Sign in with Google Identity`,
      authDescription: t`Allows users with existing Metabase accounts to login with a Google Identity account that matches their email address in addition to their Metabase username and password.
      This requires the login page to do a request to get the session is and set this as the metabase.SessionID.`,
      authType: "google_identity",
      authEnabled: settings => !!settings["google-identity-login-url"],
      widget: AuthenticationOption,
    },
  ]),
);

PLUGIN_ADMIN_SETTINGS_UPDATES.push(sections => ({
  ...sections,
  "authentication/google_identity": {
    component: SettingsGoogleIdentityForm,
    sidebar: false,
    settings: [
      { key: "google-identity-login-url" },
      { key: "google-identity-api-key" },
    ],
  },
}));
