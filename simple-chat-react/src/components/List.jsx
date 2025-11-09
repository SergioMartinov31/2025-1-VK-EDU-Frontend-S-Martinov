
export const List = ({ list }) => {
  const ListEl = list.map(({id, avatar, nickname, text, tiem }) => (
    <li key={id}>
      {id}
    </li>
  ))
  return (
    <ul>
      {ListEl}
    </ul>
  )
}