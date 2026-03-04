import React from "react";
import { Link } from "react-router-dom";
import { Theme, Topic } from "../../types/dataset";

const TopicInformation = ({topicDetails, theme} : {topicDetails: Array<Topic>, theme: Array<Theme>}) => {

  const topic = topicDetails.filter((topic) => {
    return topic.identifier === theme[0].identifier
  });

  const topicChips = [{ text: 'Topic Details', href: `/topics/${topic[0].url}` }, { text: 'Archived Data', href: `/archived-data/${topic[0].url}` }]

  return (
    <div className="ds-l-col--12">
      <div className="ds-u-margin-y--1 ds-u-font-weight--bold"><img src={`data:image/svg+xml;utf8,${encodeURIComponent(topic[0].topic_icon)}`} alt='' style={{height: '2rem'}}/> {theme[0].data}</div>
      {topicChips.map(chip => (
        <div className="ds-u-display--inline-block ds-u-fill--primary ds-u-radius--pill ds-u-padding-x--2 ds-u-padding-y--05 ds-u-margin-right--1 ds-u-font-size--sm" key={chip.text}><Link to={chip.href} className="ds-u-color--white">{chip.text}</Link></div>
      ))}
    </div>
  )
}

export default TopicInformation;