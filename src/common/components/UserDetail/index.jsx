/* eslint-disable react/jsx-handler-names */
import React, {Component, PropTypes} from 'react'
import moment from 'moment-timezone'
import {Tab, Tabs} from 'react-toolbox'
import Helmet from 'react-helmet'

import ConfirmationDialog from 'src/common/components/ConfirmationDialog'
import WrappedButton from 'src/common/components/WrappedButton'
import ContentSidebar from 'src/common/components/ContentSidebar'
import UserProjectSummary from 'src/common/components/UserProjectSummary'
import {Flex} from 'src/common/components/Layout'
import {formatPartialPhoneNumber} from 'src/common/util/format'
import {userCan} from 'src/common/util'

import styles from './index.scss'
import theme from './theme.scss'

class UserDetail extends Component {
  constructor(props) {
    super(props)
    this.renderSidebar = this.renderSidebar.bind(this)
    this.renderTabs = this.renderTabs.bind(this)
    this.renderProjects = this.renderProjects.bind(this)
    this.handleChangeTab = this.handleChangeTab.bind(this)
    this.showDeactivateUserDialog = this.showDeactivateUserDialog.bind(this)
    this.hideDeactivateUserDialog = this.hideDeactivateUserDialog.bind(this)
    this.handleDeactivateUser = this.handleDeactivateUser.bind(this)
    this.showReactivateUserDialog = this.showReactivateUserDialog.bind(this)
    this.hideReactivateUserDialog = this.hideReactivateUserDialog.bind(this)
    this.handleReactivateUser = this.handleReactivateUser.bind(this)
    this.state = {
      tabIndex: 0,
      showingDeactivateUserDialog: false,
      showingReactivateUserDialog: false
    }
  }

  showDeactivateUserDialog() {
    this.setState({showingDeactivateUserDialog: true})
  }

  hideDeactivateUserDialog() {
    this.setState({showingDeactivateUserDialog: false})
  }

  showReactivateUserDialog() {
    this.setState({showingReactivateUserDialog: true})
  }

  hideReactivateUserDialog() {
    this.setState({showingReactivateUserDialog: false})
  }

  handleChangeTab(tabIndex) {
    this.setState({tabIndex})
  }

  handleDeactivateUser() {
    const {onDeactivateUser} = this.props
    onDeactivateUser(this.props.user.id)
    this.setState({
      showingDeactivateUserDialog: false
    })
  }

  handleReactivateUser() {
    const {onReactivateUser} = this.props
    onReactivateUser(this.props.user.id)
    this.setState({
      showingReactivateUserDialog: false
    })
  }

  renderSidebar() {
    const {user, currentUser, defaultAvatarURL, onClickEdit} = this.props

    const emailLink = user.email ? (
      <a href={`mailto:${user.email}`} target="_blank" rel="noopener noreferrer">
        {user.email}
      </a>
    ) : null

    const phoneLink = user.phone ? (
      <a href={`tel:${user.phone}`} target="_blank" rel="noopener noreferrer">
        {formatPartialPhoneNumber(user.phone)}
      </a>
    ) : null

    console.log('user.active:', user.active)

    const canBeDeactivated = user.active && userCan(currentUser, 'deactivateUser')
    const canBeReactivated = !user.active && userCan(currentUser, 'reactivateUser')
    const canBeEdited = userCan(currentUser, 'updateUser')

    const deactivateUserDialog = canBeDeactivated ? (
      <ConfirmationDialog
        active={this.state.showingDeactivateUserDialog}
        confirmLabel="Yes, Deactivate"
        onClickCancel={this.hideDeactivateUserDialog}
        onClickConfirm={this.handleDeactivateUser}
        title=" "
        >
        <Flex justifyContent="center" alignItems="center">
          Are you sure you want to deactivate {user.name} ({user.handle})?
        </Flex>
      </ConfirmationDialog>
    ) : null

    const reactivateUserDialog = canBeReactivated ? (
      <ConfirmationDialog
        active={this.state.showingReactivateUserDialog}
        confirmLabel="Yes, Reactivate"
        onClickCancel={this.hideReactivateUserDialog}
        onClickConfirm={this.handleReactivateUser}
        title=" "
        >
        <Flex justifyContent="center" alignItems="center">
          Are you sure you want to reactivate {user.name} ({user.handle})?
        </Flex>
      </ConfirmationDialog>
    ) : null

    const deactivateUserButton = canBeDeactivated ? (
      <WrappedButton
        label="Deactivate"
        disabled={false}
        onClick={this.showDeactivateUserDialog}
        accent
        raised
        />
      ) : <div/>

    const reactivateUserButton = canBeReactivated ? (
      <WrappedButton
        label="Reactivate"
        disabled={false}
        onClick={this.showReactivateUserDialog}
        accent
        raised
        />
      ) : <div/>

    const editUserButton = canBeEdited ? (
      <WrappedButton
        label="Edit"
        disabled={false}
        onClick={onClickEdit}
        accent
        raised
        />
      ) : <div/>

    return (
      <ContentSidebar
        imageUrl={user.avatarUrl || defaultAvatarURL}
        imageLinkUrl={user.profileUrl}
        title={user.name}
        titleTooltip={user.id}
        subtitle={`@${user.handle}`}
        >
        <div className={styles.sidebar}>
          <Flex className={styles.section} flexDirection="column">
            <Flex className={styles.list}>
              <Flex className={styles.listLeftCol} flexDirection="column">
                <div><span>&nbsp;</span></div>
                <div>Email</div>
                <div>Phone</div>
                <div><span>&nbsp;</span></div>
                <div>Chapter</div>
                <div>Phase</div>
                <div>Joined</div>
                <div>Updated</div>
              </Flex>
              <Flex className={styles.listRightCol} flexDirection="column">
                <div><span>&nbsp;</span></div>
                <div>{emailLink || '--'}</div>
                <div>{phoneLink || '--'}</div>
                <div><span>&nbsp;</span></div>
                <div>{user.chapter ? user.chapter.name : '--'}</div>
                <div>{user.phase ? user.phase.number : '--'}</div>
                <div>{moment(user.createdAt).format('MMM DD, YYYY') || '--'}</div>
                <div>{moment(user.updatedAt).format('MMM DD, YYYY') || '--'}</div>
              </Flex>
            </Flex>
          </Flex>
          <Flex className={styles.controls}>
            {deactivateUserButton}
            {reactivateUserButton}
            {editUserButton}
          </Flex>
        </div>
        {deactivateUserDialog}
        {reactivateUserDialog}
      </ContentSidebar>
    )
  }

  renderProjects() {
    const {userProjectSummaries} = this.props
    const projectSummaries = userProjectSummaries.map((summary, i) =>
      <UserProjectSummary key={i} {...summary}/>
    )
    return (
      <div>
        {projectSummaries.length > 0 ?
          projectSummaries :
          <div>No projects yet.</div>
        }
      </div>
    )
  }

  renderTabs() {
    return (
      <div className={styles.tabs}>
        <Tabs
          index={this.state.tabIndex}
          onChange={this.handleChangeTab}
          theme={theme}
          fixed
          >
          <Tab label="Project History">
            <div>{this.renderProjects()}</div>
          </Tab>
        </Tabs>
      </div>
    )
  }

  render() {
    if (!this.props.user) {
      return null
    }

    return (
      <Flex className={styles.userDetail}>
        <Helmet>
          <title>{this.props.user.handle}</title>
        </Helmet>
        <Flex>
          {this.renderSidebar()}
        </Flex>
        <Flex fill>
          {this.renderTabs()}
        </Flex>
      </Flex>
    )
  }
}

UserDetail.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    handle: PropTypes.string,
    name: PropTypes.string,
    avatarUrl: PropTypes.string,
    chapter: PropTypes.shape({
      name: PropTypes.string,
    }),
  }),
  currentUser: PropTypes.shape({
    id: PropTypes.string,
    roles: PropTypes.array,
  }),
  userProjectSummaries: PropTypes.array,
  navigate: PropTypes.func.isRequired,
  onDeactivateUser: PropTypes.func.isRequired,
  onReactivateUser: PropTypes.func.isRequired,
  onClickEdit: PropTypes.func.isRequired,
  defaultAvatarURL: PropTypes.string,
}

export default UserDetail
