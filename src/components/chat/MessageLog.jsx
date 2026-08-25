import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/*
 * Color palette derived from msg_example.png analysis:
 *   panel bg:   #34302e  (dark warm brown)
 *   user msg:   #ff6f79  (pinkish-red bubble)
 *   bot msg:    #baa984  (tan/parchment bubble)
 *   text dark:  #1a1410
 *   text light: #f5f0e8
 */

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';

  return (
    <div style={{
      display:       'flex',
      flexDirection: isUser ? 'row-reverse' : 'row',
      alignItems:    'flex-end',
      gap:           '6px',
      marginBottom:  '10px',
    }}>
      {/* Avatar dot */}
      <div style={{
        width:         '22px',
        height:        '22px',
        borderRadius:  '50%',
        flexShrink:    0,
        background:    'linear-gradient(180deg, #d4c49a 0%, #baa984 60%, #8a7a5a 100%)',
        border:        '1.5px solid #8a7a5a',
        display:       'flex',
        alignItems:    'center',
        justifyContent:'center',
        fontSize:      '10px',
        boxShadow:     '0 1px 3px rgba(0,0,0,0.4)',
      }}>
        {isUser ? '⚔️' : '🏰'}
      </div>

      {/* Bubble — same tan colour for both, shape differs */}
      <div style={{
        maxWidth:    '72%',
        padding:     '7px 10px',
        borderRadius: isUser ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
        background:  'linear-gradient(180deg, #cfc09a 0%, #baa984 60%, #a09070 100%)',
        border:      '1.5px solid #8a7a5a',
        boxShadow:   '0 2px 0 #5a4a30, 0 3px 8px rgba(0,0,0,0.35)',
        fontSize:    '11.5px',
        lineHeight:  '1.6',
        color:       '#1a1410',
        fontWeight:  600,
        wordBreak:   'break-word',
      }}>
        {/* Render \n as real line breaks */}
        {msg.text.split('\n').map((line, i, arr) => (
          <span key={i}>
            {line}
            {i < arr.length - 1 && <br />}
          </span>
        ))}
        <div style={{
          fontSize:  '9px',
          color:     'rgba(60,40,10,0.5)',
          marginTop: '4px',
          textAlign: isUser ? 'left' : 'right',
          fontWeight:400,
        }}>
          {msg.time}
        </div>
      </div>
    </div>
  );
}

function MessageLog({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{
      flex:                  1,
      overflowY:             'auto',
      padding:               '10px 10px 4px',
      display:               'flex',
      flexDirection:         'column',
      WebkitOverflowScrolling:'touch',
      /* custom scrollbar */
      scrollbarWidth:        'thin',
      scrollbarColor:        '#5a4a35 #2a2520',
    }}>
      {messages.length === 0 && (
        <div style={{
          textAlign:  'center',
          color:      '#7a6a55',
          fontSize:   '11px',
          marginTop:  'auto',
          marginBottom:'auto',
          padding:    '20px',
          lineHeight: '1.7',
        }}>
          🏰 Welcome, Chief!<br />
          Type a command or use the buttons below.
        </div>
      )}
      {messages.map((msg) => (
        <MessageBubble key={msg.id} msg={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

MessageLog.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.shape({
    id:   PropTypes.number.isRequired,
    role: PropTypes.oneOf(['user', 'bot']).isRequired,
    text: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
  })).isRequired,
};

MessageBubble.propTypes = {
  msg: PropTypes.shape({
    role: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
  }).isRequired,
};

export default MessageLog;
