import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import _ from "underscore";
import { t, jt } from "ttag";

import Breadcrumbs from "metabase/components/Breadcrumbs";
import InputBlurChange from "metabase/components/InputBlurChange";

export default class SettingsGoogleIdentityForm extends Component {
  constructor(props, context) {
    super(props, context);
    this.updateLoginUrl = this.updateLoginUrl.bind(this);
    this.updateApiKey = this.updateApiKey.bind(this);
    (this.onCheckboxClicked = this.onCheckboxClicked.bind(this)),
      (this.saveChanges = this.saveChanges.bind(this)),
      (this.loginUrlChanged = this.loginUrlChanged.bind(this)),
      (this.apiKeyChanged = this.apiKeyChanged.bind(this));
  }

  static propTypes = {
    elements: PropTypes.array,
    updateSetting: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { elements } = this.props;
    const loginUrl = _.findWhere(elements, { key: "google-identity-login-url" });
    const apiKey = _.findWhere(elements, {key: "google-identity-api-key"});

    this.setState({
      loginUrl: loginUrl,
      apiKey: apiKey,
      loginUrlValue: loginUrl.value,
      apiKeyValue: apiKey.value,
      recentlySaved: false,
    });
  }

  updateLoginUrl(newValue) {
    if (newValue === this.state.loginUrlValue) {
      return;
    }

    this.setState({
      loginUrlValue: newValue && newValue.length ? newValue : null,
      recentlySaved: false,
    });
  }

  updateApiKey(newValue) {
    if (newValue === this.state.apiKey.apiKeyValue) {
      return;
    }

    this.setState({
      apiKeyValue: newValue && newValue.length ? newValue : null,
      recentlySaved: false,
    });
  }

  loginUrlChanged() {
    return this.state.loginUrl.value !== this.state.loginUrlValue;
  }

  apiKeyChanged() {
    return this.state.apiKey.value !== this.state.apiKeyValue;
  }

  saveChanges() {
    const { loginUrl, loginUrlValue, apiKey, apiKeyValue } = this.state;

    if (this.loginUrlChanged()) {
      this.props.updateSetting(loginUrl, loginUrlValue);
      this.setState({
        loginUrl: {
          value: loginUrlValue,
        },
        recentlySaved: true,
      });
    }

    if (this.apiKeyChanged()) {
      this.props.updateSetting(apiKey, apiKeyValue);
      this.setState({
        apiKey: {
          value: apiKeyValue,
        },
        recentlySaved: true,
      });
    }
  }

  onCheckboxClicked() {
    // if domain is present, clear it out; otherwise if there's no domain try to set it back to what it was
    this.setState({
      apiKeyValue: this.state.apiKeyValue ? null : this.state.domain.value,
      recentlySaved: false,
    });
  }

  render() {
    const hasChanges = this.apiKeyChanged() || this.loginUrlChanged();
    const hasLoginUrl = this.state.loginUrlValue;

    return (
      <form noValidate>
        <div className="px2" style={{ maxWidth: "585px" }}>
          <Breadcrumbs
            crumbs={[
              [t`Authentication`, "/admin/settings/authentication"],
              [t`Google Identity`],
            ]}
            className="mb2"
          />
          <h2>{t`Sign in with Google Identity`}</h2>
          <p className="text-medium">
            {t`Allows users with existing Metabase accounts to login with a Google Cloud Identity account that matches their email address.`}
          </p>
          <p className="text-medium">
            {jt`To allow users to sign in with Google Cloud Identity you'll need to give Metabase a redirect url for logout and the APIKey from google identity.`}
          </p>
          <div className="flex align-center">
            <p className="text-medium">{t`Specify the Redirect URL that will be used when logging out.`}</p>
          </div>
          <InputBlurChange
            className="SettingsInput AdminInput bordered rounded h3"
            type="text"
            value={this.state.loginUrlValue}
            placeholder={t`Your Google Identity Login URL`}
            onChange={event => this.updateLoginUrl(event.target.value)}
          />
          <div className="py3">
            <div className="flex align-center">
              <p className="text-medium">{t`Specify the API key that will be used to verify the login request`}</p>
            </div>

              <InputBlurChange
                className="SettingsInput AdminInput bordered rounded h3"
                type="text"
                value={this.state.apiKeyValue}
                placeholder={t`Your Google Identity APIKey`}
                onChange={event => this.updateApiKey(event.target.value)}
                disabled={!hasLoginUrl}
              />
          </div>

          <button
            className={cx("Button mr2", { "Button--primary": hasChanges })}
            disabled={!hasChanges}
            onClick={this.saveChanges}
          >
            {this.state.recentlySaved ? t`Changes saved!` : t`Save Changes`}
          </button>
        </div>
      </form>
    );
  }
}
