import React from 'react';
import {mount} from 'enzyme';
import sinon from 'sinon';
import {expect} from '../../../../util/configuredChai';
import ManageLinkedAccounts, {ENCRYPTED} from '@cdo/apps/lib/ui/accounts/ManageLinkedAccounts';

const DEFAULT_PROPS = {
  userType: 'student',
  authenticationOptions: [],
  connect: () => {},
  disconnect: () => {},
};

describe('ManageLinkedAccounts', () => {
  it('renders a table with oauth provider rows', () => {
    const wrapper = mount(
      <ManageLinkedAccounts
        {...DEFAULT_PROPS}
      />
    );
    expect(wrapper.find('table')).to.exist;
    expect(wrapper.find('OauthConnection').at(0)).to.include.text('Google Account');
    expect(wrapper.find('OauthConnection').at(1)).to.include.text('Microsoft Account');
    expect(wrapper.find('OauthConnection').at(2)).to.include.text('Clever Account');
    expect(wrapper.find('OauthConnection').at(3)).to.include.text('Facebook Account');
  });

  it('renders an empty message for unconnected authentication options', () => {
    const wrapper = mount(
      <ManageLinkedAccounts
        {...DEFAULT_PROPS}
      />
    );
    const googleEmailCell = wrapper.find('OauthConnection').at(0).find('td').at(1);
    expect(googleEmailCell).to.have.text('Not Connected');
  });

  it('does not render student email for authentication options', () => {
    const authOptions = [
      {
        id: 1,
        credential_type: 'google_oauth2',
        email: 'student@email.com'
      }
    ];
    const wrapper = mount(
      <ManageLinkedAccounts
        {...DEFAULT_PROPS}
        userType="student"
        authenticationOptions={authOptions}
      />
    );
    const googleEmailCell = wrapper.find('OauthConnection').at(0).find('td').at(1);
    expect(googleEmailCell).to.have.text(ENCRYPTED);
  });

  it('renders teacher email for authentication options', () => {
    const authOptions = [
      {
        id: 1,
        credential_type: 'google_oauth2',
        email: 'teacher@email.com'
      }
    ];
    const wrapper = mount(
      <ManageLinkedAccounts
        {...DEFAULT_PROPS}
        userType="teacher"
        authenticationOptions={authOptions}
      />
    );
    const googleEmailCell = wrapper.find('OauthConnection').at(0).find('td').at(1);
    expect(googleEmailCell).to.have.text('teacher@email.com');
  });

  it('calls connect if authentication option is not connected', () => {
    const connect = sinon.stub();
    const wrapper = mount(
      <ManageLinkedAccounts
        {...DEFAULT_PROPS}
        connect={connect}
      />
    );
    wrapper.find('BootstrapButton').at(0).simulate('click');
    expect(connect).to.have.been.calledOnce;
  });

  it('calls disconnect if authentication option is connected', () => {
    const authOptions = [
      {
        id: 1,
        credential_type: 'google_oauth2',
        email: 'student@email.com'
      }
    ];
    const disconnect = sinon.stub().resolves();
    const wrapper = mount(
      <ManageLinkedAccounts
        {...DEFAULT_PROPS}
        authenticationOptions={authOptions}
        disconnect={disconnect}
      />
    );
    wrapper.find('BootstrapButton').at(0).simulate('click');
    expect(disconnect).to.have.been.calledOnce;
  });
});
