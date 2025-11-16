import {ChatList} from '../../components/ChatList/ChatList'
import { Link } from 'react-router-dom'

export const PageChatList = ({ ChatsLog}) => {
  return (
    <ChatList ChatsLog = {ChatsLog} ></ChatList>
  )
}