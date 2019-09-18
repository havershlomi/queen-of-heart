import React from 'react';
import Grid from "@material-ui/core/Grid/Grid";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar/Avatar";
import UserIcon from "@material-ui/core/SvgIcon/SvgIcon";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";

export default function PlayersList(props) {

    return (
        <Grid container spacing={2} wrap="nowrap">
            <Grid item xs={3} md={4} lg={5}></Grid>
            <Grid item xs={6} md={4} lg={2}>
                <List dense={false}>
                    {props.players.map(player => {
                        return (<ListItem key={player.id}>
                            <ListItemAvatar>
                                <Avatar>
                                    <UserIcon/>
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={player.name + (player.id === props.playerId.current ? " - You" : "")}
                            />
                        </ListItem>)
                    })}
                </List>
            </Grid>
        </Grid>)
};