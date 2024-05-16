function MessagesListView({messages, compute_class_name}) {
  return messages.map ( (msg, idx) => (
    <div key={idx} className={compute_class_name(msg.you)}>
      <div key={idx + 1} className="chat-bubble">
        {msg.content}
      </div>
      
    </div>
  ))
}


export default MessagesListView;
