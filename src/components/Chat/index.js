import React, { useEffect, useState, useRef } from 'react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Player } from '@lottiefiles/react-lottie-player'
import Countdown, { zeroPad } from 'react-countdown'
import { Scrollbars } from 'react-custom-scrollbars-2'
import ReactTooltip from 'react-tooltip'
import toast, { Toaster } from 'react-hot-toast'
import { useAccount } from 'wagmi'
import { ethers } from 'ethers'

const Chat = () => {
  const [allWaves, setAllWaves] = useState([])
  const [message, setMessage] = useState('')
  const [walletTooltip, showWalletTooltip] = useState(true)
  const [timeTooltip, showTimeTooltip] = useState(true)
  const [paidTooltip, showPaidTooltip] = useState(true)
  const [showPointEmotic, setShowPointEmotic] = useState(false)
  const [wavingStatus, setWavingStatus] = useState('wave')
  const [isStartCountDown, setIsStartCountDown] = useState(false)
  const [startTime, setStartTime] = useState(Date.now())

  const clockStartRef = useRef()
  const handleStartGroup = () => clockStartRef.current.start()

  const { openConnectModal } = useConnectModal()
  const { address, isConnected } = useAccount()

  const getMessage = (event) => {
    setShowPointEmotic(false)
    setMessage(event.target.value)
  }

  const wave = async () => {
    if (message === '') {
      toast('Let me know what you think of me!', {
        style: {
          border: '1px solid #38bdf8',
          padding: '8px 16px',
          color: '#38bdf8',
          background: '#1b2735',
        },
        iconTheme: {
          primary: '#38bdf8',
          secondary: '#FFFAEE',
        },
        icon: '🤞',
      })
      setTimeout(() => setShowPointEmotic(true), 1000)
    } else {

    }
  }

  useEffect(() => {
    if (isStartCountDown) {
      handleStartGroup()
    }
  }, [isStartCountDown])



  const isValidUrl = (urlString) => {
    const urlPattern = new RegExp(
      '([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?',
    )
    return !!urlPattern.test(urlString)
  }

  const getURL = (urlString) => {
    const matches = urlString.match(/\bhttps?:\/\/\S+/gi)
    return matches
  }

  const stringContainURL = (msg) => {
    const URLs = getURL(msg)
    const firstLetter = msg.slice(0, msg.indexOf(URLs[0]))
    const lastLetter = msg.slice(
      msg.indexOf(URLs[URLs.length - 1]) + URLs[URLs.length - 1].length,
      msg.length,
    )
    return (
      <div className="text-sm">
        {firstLetter}
        {firstLetter.length > 0 && <br />}
        {URLs.map((url, index) => {
          return (
            <>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 transition-all hover:text-gray-200 hover:underline"
              >
                {url}
              </a>
              <br />
              {msg.indexOf(URLs[index + 1]) !== -1 && (
                <div>
                  {msg.slice(
                    msg.indexOf(url) + url.length,
                    msg.indexOf(URLs[index + 1]),
                  )}
                </div>
              )}
            </>
          )
        })}
        {lastLetter}
      </div>
    )
  }

  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <div>Send</div>
    } else {
      // Render a countdown
      return (
        <span>
          {zeroPad(minutes)}:{zeroPad(seconds)}
        </span>
      )
    }
  }

  const chatBox = document.getElementById('chat-box')?.children[0]?.children[0]
  chatBox?.classList.add('flex', 'flex-col', '!relative', 'md:!absolute')

  return (
    <div className="w-full flex justify-center">
      <div className="w-full md:w-2/3 xl:w-2/5 mx-3 flex flex-col justify-center items-start">
        <div
          className={`w-full flex flex-col items-start ${showPointEmotic && '-mt-2'
            }`}
        >
          <div className="w-full flex">
            <div className="flex items-center">
              {showPointEmotic && (
                <Player
                  autoplay
                  loop
                  src="https://assets9.lottiefiles.com/private_files/lf30_lo8abkil.json"
                  className="w-24 h-24"
                />
              )}
            </div>
            <textarea
              rows={3}
              maxLength={160}
              className="w-full bg-slate-500/20 border-none outline-none px-4 py-2 rounded-xl"
              value={message}
              onChange={(e) => getMessage(e)}
            />
          </div>
          {/* <div className="w-full flex items-center justify-between mt-1"> */}
          {/* <div className="text-lg cursor-pointer"><Icon icon="ic:baseline-insert-emoticon" width={20} height={20} /></div> */}
          <div
            className={`self-end ${message.length === 160 && 'text-rose-500'}`}
          >
            {message.length} / 160
          </div>
          {/* </div> */}
          {isConnected ? (
            isStartCountDown ? (
              <button className="relative px-5 py-1 font-medium text-white group self-end">
                <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-0 -skew-x-12 bg-slate-500"></span>
                <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform skew-x-12 bg-slate-700"></span>
                <span className="absolute bottom-0 left-0 hidden w-10 h-20 transition-all duration-100 ease-out transform -translate-x-8 translate-y-10 bg-slate-600 -rotate-12"></span>
                <span className="absolute bottom-0 right-0 hidden w-10 h-20 transition-all duration-100 ease-out transform translate-x-10 translate-y-8 bg-slate-400 -rotate-12"></span>
                <span className="relative">
                  <Countdown
                    date={startTime}
                    renderer={renderer}
                    ref={clockStartRef}
                  />
                </span>
              </button>
            ) : (
              <button
                className="relative px-5 py-1 font-medium text-white group self-end"
                onClick={() => wave()}
              >
                <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-0 -skew-x-12 bg-sky-500 group-hover:bg-sky-700 group-hover:skew-x-12"></span>
                <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform skew-x-12 bg-sky-700 group-hover:bg-sky-500 group-hover:-skew-x-12"></span>
                <span className="absolute bottom-0 left-0 hidden w-10 h-20 transition-all duration-100 ease-out transform -translate-x-8 translate-y-10 bg-sky-600 -rotate-12"></span>
                <span className="absolute bottom-0 right-0 hidden w-10 h-20 transition-all duration-100 ease-out transform translate-x-10 translate-y-8 bg-sky-400 -rotate-12"></span>
                <span className="relative">
                  {wavingStatus === 'waving' ? 'Sending...' : 'Send'}
                </span>
              </button>
            )
          ) : (
            openConnectModal && (
              <button
                className="relative px-5 py-1 font-medium text-white group self-end"
                onClick={openConnectModal}
              >
                <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-0 -skew-x-12 bg-sky-500 group-hover:bg-sky-700 group-hover:skew-x-12"></span>
                <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform skew-x-12 bg-sky-700 group-hover:bg-sky-500 group-hover:-skew-x-12"></span>
                <span className="absolute bottom-0 left-0 hidden w-10 h-20 transition-all duration-100 ease-out transform -translate-x-8 translate-y-10 bg-sky-600 -rotate-12"></span>
                <span className="absolute bottom-0 right-0 hidden w-10 h-20 transition-all duration-100 ease-out transform translate-x-10 translate-y-8 bg-sky-400 -rotate-12"></span>
                <span className="relative">Connect</span>
              </button>
            )
          )}
        </div>
        <Toaster />
        <div
          id="chat-box"
          className="w-full h-full md:h-[calc(100vh-260px)] overflow-auto my-5 md:mt-5 md:mb-0 flex flex-col rounded-xl"
        >
          {/* <Scrollbars autoHide>
            {allWaves.map((wave, index) => {
              return (
                <div
                  key={index}
                  className={`w-fit bg-slate-500/20 py-2 px-4 pr-2 rounded-xl mt-1 max-w-lg ${address === wave.address && 'self-end bg-sky-500/20'
                    }`}
                >
                  <div className="flex items-center">
                    <div
                      className="text-xs text-slate-500 cursor-pointer"
                      data-tip
                      data-for={`wallet-${index}`}
                      onMouseEnter={() => showWalletTooltip(true)}
                      onMouseLeave={() => {
                        showWalletTooltip(false)
                        setTimeout(() => showWalletTooltip(true), 50)
                      }}
                    >
                      {wave.address.slice(0, 10)}...
                    </div>
                    {wave.isPaid && (
                      <div
                        data-tip
                        data-for={`paid-${index}`}
                        onMouseEnter={() => showPaidTooltip(true)}
                        onMouseLeave={() => {
                          showPaidTooltip(false)
                          setTimeout(() => showPaidTooltip(true), 50)
                        }}
                        className="text-xs ml-1 cursor-pointer"
                      >
                        🎉
                      </div>
                    )}
                    {paidTooltip && (
                      <ReactTooltip id={`paid-${index}`}>
                        {address === wave.address
                          ? '🎉 Congratulations! You'
                          : 'This user'}{' '}
                        won 0.0001ETH by writing this msg!
                      </ReactTooltip>
                    )}
                  </div>
                  {walletTooltip && (
                    <ReactTooltip id={`wallet-${index}`}>
                      {wave.address}
                    </ReactTooltip>
                  )}
                  <div className="flex justify-between items-end">
                    {isValidUrl(wave.message) ? (
                      stringContainURL(wave.message)
                    ) : (
                      <div className="text-sm">{wave.message}</div>
                    )}
                    <div className="flex ml-3 mt-2 opacity-70">
                      <div
                        data-tip
                        data-for={`time-${index}`}
                        onMouseEnter={() => showTimeTooltip(true)}
                        onMouseLeave={() => {
                          showTimeTooltip(false)
                          setTimeout(() => showTimeTooltip(true), 50)
                        }}
                        className="cursor-pointer text-xs text-slate-500"
                      >
                        {wave.timestamp.getHours()}:
                        {wave.timestamp.getMinutes()}
                      </div>
                      {timeTooltip && (
                        <ReactTooltip id={`time-${index}`}>
                          {wave.timestamp.toLocaleString()}
                        </ReactTooltip>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </Scrollbars> */}
        </div>
      </div>
    </div>
  )
}

export default Chat
