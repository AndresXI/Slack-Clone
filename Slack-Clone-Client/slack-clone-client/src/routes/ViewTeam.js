import React from 'react';
import { Redirect } from 'react-router-dom';
import { Query, Mutation } from 'react-apollo';
import findIndex from 'lodash/findIndex';

import Header from '../components/Header';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';
import Sidebar from '../containers/Sidebar';
import { GET_ALL_TEAMS } from '../graphql/team';
import { CREATE_MESSAGE_MUTATION } from '../graphql/message';


const ViewTeam = ({ match: { params: { teamId, channelId } } }) => (
  <Query query={GET_ALL_TEAMS}>
    {({ loading, data: { allTeams, inviteTeams } }) => {
      if (loading) return null;

      // merge owner teams and teams he got invited to
      const allTeamsList = [...allTeams, ...inviteTeams];

      if (!allTeamsList.length) {
        return (<Redirect to="/create-team" />);
      }
      console.log(allTeamsList);
      // Gets the current team to display, if no teams then display
      // default team "general"
      const teamIdInteger = parseInt(teamId, 10);
      const teamIdx = teamIdInteger ? findIndex(allTeamsList, ['id', teamIdInteger]) : 0;
      const currentTeam = teamIdx === -1 ? allTeamsList[0] : allTeamsList[teamIdx];

      const channelIdInteger = parseInt(channelId, 10);
      const channelIdx = channelIdInteger ? findIndex(currentTeam.channels, ['id', channelIdInteger]) : 0;
      const currentChannel = channelIdx === -1 ? currentTeam.channels[0] : currentTeam.channels[channelIdx];

      return (
        <div className="app-layout">
          <Sidebar
            teams={allTeamsList.map(t => ({
              id: t.id,
              letter: t.name.charAt(0).toUpperCase(),
            }))}
            team={currentTeam}
            teamIdx={teamIdx}
            className="channels"
          />
          {currentChannel && <Header channelName={currentChannel.name} />}
          {currentChannel && (
            <Messages channelId={currentChannel.id}>
              <ul>
                <li />
                <li />
              </ul>
            </Messages>
          )}
          {currentChannel && (
            <Mutation mutation={CREATE_MESSAGE_MUTATION}>
              {createMessage => (
                <SendMessage
                  createMessage={createMessage}
                  channelName={currentChannel.name}
                />
              )}
            </Mutation>
          )}
        </div>
      );
    }}
  </Query>
);

export default ViewTeam;
