import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import Block from "components/services/widget/block";
import Container from "components/services/widget/container";

function parseIncrement(increment) {
  const match = increment.match(/^(\d+)([smhdw])$/);
  if (!match) return null;
  
  const [, amount, unit] = match;
  const multipliers = {
    s: 1000,                // seconds to milliseconds
    m: 60 * 1000,           // minutes to milliseconds
    h: 60 * 60 * 1000,      // hours to milliseconds
    d: 24 * 60 * 60 * 1000, // days to milliseconds
    w: 7 * 24 * 60 * 60 * 1000 // weeks to milliseconds
  };
  
  return parseInt(amount, 10) * multipliers[unit];
}

function calculateNextOccurrence(referenceTime, increment) {
  const referenceDate = new Date(referenceTime);
  const incrementMs = parseIncrement(increment);
  
  if (!incrementMs || Number.isNaN(referenceDate.getTime())) {
    return null;
  }
  
  const now = new Date();
  const timeSinceReference = now.getTime() - referenceDate.getTime();
  
  if (timeSinceReference <= 0) {
    // Reference time is in the future
    return referenceDate;
  }
  
  // Calculate how many complete cycles have passed
  const cyclesPassed = Math.floor(timeSinceReference / incrementMs);
  
  // Calculate next occurrence
  const nextOccurrence = new Date(referenceDate.getTime() + (cyclesPassed + 1) * incrementMs);
  
  return nextOccurrence;
}

function formatCountdown(timeLeft, countdownFormat = "auto") {
  if (timeLeft <= 0) return "00:00:00";
  
  const totalSeconds = Math.floor(timeLeft / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  switch (countdownFormat) {
    case "full":
      // Always show D:HH:MM:SS
      return `${days}d ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    
    case "hours":
      // Always show HH:MM:SS (days converted to hours)
      const totalHours = days * 24 + hours;
      return `${totalHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    
    case "minutes":
      // Always show MM:SS (hours/days converted to minutes)
      const totalMinutes = days * 1440 + hours * 60 + minutes;
      return `${totalMinutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    
    case "compact":
      // Most compact: only show largest non-zero unit
      if (days > 0) return `${days}d`;
      if (hours > 0) return `${hours}h`;
      if (minutes > 0) return `${minutes}m`;
      return `${seconds}s`;
    
    case "auto":
    default:
      // Auto-adjust based on time remaining
      if (days > 0) {
        return `${days}d ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      }
      if (hours > 0) {
        return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      }
      return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
}

function formatNextEvent(nextEvent, dateFormat, locale) {
  if (!nextEvent) return "";
  
  // Predefined formats
  const presetFormats = {
    short: {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    },
    medium: {
      month: "short", 
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short"
    },
    long: {
      weekday: "long",
      month: "long", 
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short"
    },
    datetime: null, // Special case for YYYY-MM-DD HH:mm:ss format
    iso: null, // Special case for ISO string
    relative: null // Special case for relative time
  };
  
  // Handle special formats
  if (dateFormat === "datetime") {
    const year = nextEvent.getFullYear();
    const month = String(nextEvent.getMonth() + 1).padStart(2, '0');
    const day = String(nextEvent.getDate()).padStart(2, '0');
    const hours = String(nextEvent.getHours()).padStart(2, '0');
    const minutes = String(nextEvent.getMinutes()).padStart(2, '0');
    const seconds = String(nextEvent.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  
  if (dateFormat === "iso") {
    return nextEvent.toISOString();
  }
  
  if (dateFormat === "relative") {
    const now = new Date();
    const diffMs = nextEvent.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `in ${diffDays} day${diffDays !== 1 ? "s" : ""}`;
    }
    if (diffHours > 0) {
      return `in ${diffHours} hour${diffHours !== 1 ? "s" : ""}`;
    }
    return "soon";
  }
  
  // Use preset format or custom format object
  const formatOptions = presetFormats[dateFormat] || dateFormat || presetFormats.medium;
  
  try {
    return new Intl.DateTimeFormat(locale, formatOptions).format(nextEvent);
  } catch (error) {
    // Invalid date format, fall back to medium format
    return new Intl.DateTimeFormat(locale, presetFormats.medium).format(nextEvent);
  }
}

export default function Component({ service }) {
  const { i18n } = useTranslation();
  const [nextEvent, setNextEvent] = useState(null);
  const [countdown, setCountdown] = useState("");
  const [error, setError] = useState(null);
  
  // Access widget configuration from service
  const { widget } = service;
  const { 
    reference_time: referenceTime, 
    increment, 
    name, 
    description,
    date_format: dateFormat = "medium",
    countdown_format: countdownFormat = "auto"
  } = widget || {};
  

  useEffect(() => {
    if (!referenceTime || !increment) {
      setError("Missing reference_time or increment in widget config");
      return () => {};
    }

    const updateTimer = () => {
      const nextOccurrence = calculateNextOccurrence(referenceTime, increment);
      
      if (!nextOccurrence) {
        setError("Invalid reference_time or increment format");
        return;
      }
      
      setNextEvent(nextOccurrence);
      
      const now = new Date();
      const timeLeft = nextOccurrence.getTime() - now.getTime();
      setCountdown(formatCountdown(timeLeft, countdownFormat));
      
      // If the event has passed, recalculate
      if (timeLeft <= 0) {
        const newNext = calculateNextOccurrence(referenceTime, increment);
        if (newNext) {
          setNextEvent(newNext);
          setCountdown(formatCountdown(newNext.getTime() - now.getTime(), countdownFormat));
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [referenceTime, increment, countdownFormat]);

  if (error) {
    return (
      <Container service={service}>
        <Block label="Error" value={error} />
      </Container>
    );
  }

  const nextEventFormatted = nextEvent 
    ? formatNextEvent(nextEvent, dateFormat, i18n.language)
    : "Calculating...";

  return (
    <Container service={service}>
      {name && <Block label="Event" value={name} />}
      <Block label="Next" value={nextEventFormatted} />
      <Block label="Countdown" value={countdown} />
      {description && <Block label="Info" value={description} />}
    </Container>
  );
}