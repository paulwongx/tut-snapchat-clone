import { Avatar } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import './Chats.css';
import SearchIcon from '@material-ui/icons/Search';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import { auth, db } from './firebase';
import Chat from './Chat';
import { selectUser } from './features/appSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { resetCameraImage } from './features/cameraSlice';

function Chats() {
	const [posts, setPosts] = useState([]);
	const user = useSelector(selectUser);
	const dispatch = useDispatch();
	const history = useHistory();

	const takeSnap = () => {
        dispatch(resetCameraImage());
		history.push('/');
	};

	useEffect(() => {
		db.collection('posts')
			.orderBy('timestamp', 'desc')
			.onSnapshot(snapshot => {
				console.log('snapshot docs', snapshot.docs);
				setPosts(
					snapshot.docs.map(doc => ({
						id: doc.id,
						data: doc.data(),
					}))
				);
			});
	}, []);

	useEffect(() => {
		console.log('posts', posts);
	}, [posts]);

	return (
		<div className='chats'>
			<div className='chats__header'>
				<Avatar
					onClick={() => auth.signOut()}
					src={user.profilePic}
					className='chats__avatar'
				/>
				<div className='chats__search'>
					<SearchIcon className='chats__searchIcon' />
					<input placeholder='Friends' type='text' />
				</div>
				<ChatBubbleIcon className='chats__chatIcon' />
			</div>

			<div className='chats__posts'>
				{posts.map(
					({
						id,
						data: {
							profilePic,
							username,
							timestamp,
							imageUrl,
							read,
						},
					}) => (
						<Chat
							key={id}
							id={id}
							username={username}
							timestamp={timestamp}
							imageUrl={imageUrl}
							read={read}
							profilePic={profilePic}
						/>
					)
				)}
			</div>

			<RadioButtonUncheckedIcon
				className='chats__takePicIcon'
				onClick={takeSnap}
				fontSize='large'
			/>
		</div>
	);
}

export default Chats;
