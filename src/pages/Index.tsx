
import React, { useState, useEffect } from 'react';
import { Clock, CloudRain, CloudSnow, Cloud, Sun, Timer, Search, Globe, Heart, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const translations = {
  en: {
    currentTime: "Current Time",
    weather: "Weather",
    countdownTimer: "Countdown Timer",
    searchCity: "Search city...",
    temperature: "Temperature",
    humidity: "Humidity",
    windSpeed: "Wind Speed",
    setTimer: "Set Timer",
    start: "Start",
    pause: "Pause",
    reset: "Reset",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    timeUp: "Time's Up!",
    madeWith: "Made with",
    by: "by Lovable and ChatGPT",
    selectTimezone: "Select Timezone"
  },
  vi: {
    currentTime: "Thời Gian Hiện Tại",
    weather: "Thời Tiết",
    countdownTimer: "Đếm Ngược",
    searchCity: "Tìm thành phố...",
    temperature: "Nhiệt Độ",
    humidity: "Độ Ẩm",
    windSpeed: "Tốc Độ Gió",
    setTimer: "Đặt Giờ",
    start: "Bắt Đầu",
    pause: "Tạm Dừng",
    reset: "Đặt Lại",
    hours: "Giờ",
    minutes: "Phút",
    seconds: "Giây",
    timeUp: "Hết Giờ!",
    madeWith: "Được tạo với",
    by: "bởi Lovable và ChatGPT",
    selectTimezone: "Chọn Múi Giờ"
  }
};

const timezones = [
  { value: 'Asia/Ho_Chi_Minh', label: 'Ho Chi Minh City (GMT+7)', flag: '🇻🇳' },
  { value: 'America/New_York', label: 'New York (GMT-5)', flag: '🇺🇸' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-8)', flag: '🇺🇸' },
  { value: 'Europe/London', label: 'London (GMT+0)', flag: '🇬🇧' },
  { value: 'Europe/Paris', label: 'Paris (GMT+1)', flag: '🇫🇷' },
  { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9)', flag: '🇯🇵' },
  { value: 'Asia/Seoul', label: 'Seoul (GMT+9)', flag: '🇰🇷' },
  { value: 'Australia/Sydney', label: 'Sydney (GMT+11)', flag: '🇦🇺' },
  { value: 'Asia/Shanghai', label: 'Shanghai (GMT+8)', flag: '🇨🇳' },
  { value: 'Asia/Dubai', label: 'Dubai (GMT+4)', flag: '🇦🇪' }
];

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('Ho Chi Minh City');
  const [searchCity, setSearchCity] = useState('');
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 5, seconds: 0 });
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [language, setLanguage] = useState('en');
  const [selectedTimezone, setSelectedTimezone] = useState('Asia/Ho_Chi_Minh');
  const [isAnimating, setIsAnimating] = useState(false);

  const t = translations[language];

  // Clock functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Weather functionality
  const fetchWeather = async (cityName) => {
    setIsAnimating(true);
    try {
      const API_KEY = 'bd5e378503939ddaee76f12ad7a97608';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      if (response.ok) {
        setTimeout(() => {
          setWeather(data);
          setCity(cityName);
          setIsAnimating(false);
        }, 500);
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
      setIsAnimating(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleCitySearch = () => {
    if (searchCity.trim()) {
      fetchWeather(searchCity);
      setSearchCity('');
    }
  };

  const getWeatherIcon = (weatherMain) => {
    switch (weatherMain?.toLowerCase()) {
      case 'rain':
        return <CloudRain className="w-16 h-16 text-blue-400 animate-bounce" />;
      case 'snow':
        return <CloudSnow className="w-16 h-16 text-blue-200 animate-pulse" />;
      case 'clouds':
        return <Cloud className="w-16 h-16 text-gray-400 animate-pulse" />;
      default:
        return <Sun className="w-16 h-16 text-yellow-400 animate-spin-slow" />;
    }
  };

  // Countdown functionality
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      // Play notification sound
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaAzuO1u+9dSFIJnLE7tKEOQcacLPy66hSF');
      audio.play().catch(() => {});
      alert(t.timeUp);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, t.timeUp]);

  const startTimer = () => {
    const totalSeconds = countdown.hours * 3600 + countdown.minutes * 60 + countdown.seconds;
    setTimeLeft(totalSeconds);
    setIsActive(true);
  };

  const pauseTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(0);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeInTimezone = (timezone) => {
    return new Date().toLocaleTimeString('en-US', { 
      hour12: false,
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getDateInTimezone = (timezone) => {
    return new Date().toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: timezone
    });
  };

  const selectedTimezoneData = timezones.find(tz => tz.value === selectedTimezone);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6 animate-fade-in">
      {/* Floating particles background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-30"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-40"></div>
        <div className="absolute top-1/2 left-3/4 w-1 h-1 bg-pink-400 rounded-full animate-bounce opacity-50"></div>
      </div>

      {/* Language Selector */}
      <div className="fixed top-6 right-6 z-50 animate-slide-in-right">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-24 bg-white/10 backdrop-blur-lg border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105">
            <Globe className="w-4 h-4 mr-1" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white/95 backdrop-blur-lg border-white/20">
            <SelectItem value="en" className="hover:bg-blue-50">EN</SelectItem>
            <SelectItem value="vi" className="hover:bg-blue-50">VI</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center py-12 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
            Multi-Function Timer
          </h1>
          <p className="text-2xl text-white/80 font-light animate-slide-in-up">Clock • Weather • Countdown</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Time */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-8 text-white shadow-2xl hover:bg-white/15 transition-all duration-500 group animate-scale-in hover:scale-105 hover:shadow-3xl">
            <div className="flex items-center justify-center mb-6">
              <Clock className="w-10 h-10 mr-3 text-blue-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
              <h2 className="text-3xl font-bold">{t.currentTime}</h2>
            </div>
            
            {/* Timezone Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-white/80">{t.selectTimezone}</label>
              <Select value={selectedTimezone} onValueChange={setSelectedTimezone}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white hover:bg-white/25 transition-all duration-300">
                  <MapPin className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-lg border-white/20 max-h-60">
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value} className="hover:bg-blue-50">
                      <span className="flex items-center gap-2">
                        <span>{tz.flag}</span>
                        <span>{tz.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="text-center space-y-4">
              <div className="text-5xl font-mono font-bold mb-4 text-blue-100 tracking-wider animate-pulse">
                {getTimeInTimezone(selectedTimezone)}
              </div>
              <div className="text-xl text-white/80 font-medium animate-fade-in">
                {getDateInTimezone(selectedTimezone)}
              </div>
              {selectedTimezoneData && (
                <div className="flex items-center justify-center gap-2 text-lg animate-slide-in-up">
                  <span className="text-2xl">{selectedTimezoneData.flag}</span>
                  <span className="text-white/90">{selectedTimezoneData.label.split(' (')[0]}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Weather */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-8 text-white shadow-2xl hover:bg-white/15 transition-all duration-500 group animate-scale-in hover:scale-105 hover:shadow-3xl">
            <div className="flex items-center justify-center mb-6">
              <CloudRain className="w-10 h-10 mr-3 text-blue-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
              <h2 className="text-3xl font-bold">{t.weather}</h2>
            </div>
            
            <div className="flex gap-3 mb-6">
              <Input
                placeholder={t.searchCity}
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCitySearch()}
                className="bg-white/20 border-white/30 text-white placeholder-white/60 focus:bg-white/25 transition-all duration-300 focus:scale-105"
              />
              <Button 
                onClick={handleCitySearch}
                className="bg-blue-600 hover:bg-blue-700 px-4 transition-all duration-300 hover:scale-105 hover:rotate-3"
              >
                <Search className={`w-5 h-5 ${isAnimating ? 'animate-spin' : ''}`} />
              </Button>
            </div>

            {weather && (
              <div className={`text-center space-y-4 ${isAnimating ? 'animate-pulse' : 'animate-fade-in'}`}>
                <div className="flex justify-center mb-6">
                  {getWeatherIcon(weather.weather[0].main)}
                </div>
                <h3 className="text-2xl font-bold mb-3 animate-slide-in-up">{weather.name}</h3>
                <div className="text-4xl font-bold mb-6 text-blue-100 animate-bounce">{Math.round(weather.main.temp)}°C</div>
                <div className="space-y-3 text-base">
                  <div className="flex justify-between items-center p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 animate-slide-in-left">
                    <span className="font-medium">{t.humidity}:</span>
                    <span className="text-blue-200">{weather.main.humidity}%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-300 animate-slide-in-right">
                    <span className="font-medium">{t.windSpeed}:</span>
                    <span className="text-blue-200">{weather.wind.speed} m/s</span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Countdown Timer */}
          <Card className="bg-white/10 backdrop-blur-xl border-white/20 p-8 text-white shadow-2xl hover:bg-white/15 transition-all duration-500 group animate-scale-in hover:scale-105 hover:shadow-3xl">
            <div className="flex items-center justify-center mb-6">
              <Timer className="w-10 h-10 mr-3 text-purple-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
              <h2 className="text-3xl font-bold">{t.countdownTimer}</h2>
            </div>

            {!isActive && timeLeft === 0 ? (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-xl font-semibold text-center mb-4">{t.setTimer}</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="animate-slide-in-left">
                    <label className="block text-sm mb-2 font-medium">{t.hours}</label>
                    <Input
                      type="number"
                      min="0"
                      max="23"
                      value={countdown.hours}
                      onChange={(e) => setCountdown({...countdown, hours: parseInt(e.target.value) || 0})}
                      className="bg-white/20 border-white/30 text-white text-center focus:bg-white/25 transition-all duration-300 focus:scale-105"
                    />
                  </div>
                  <div className="animate-slide-in-up">
                    <label className="block text-sm mb-2 font-medium">{t.minutes}</label>
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      value={countdown.minutes}
                      onChange={(e) => setCountdown({...countdown, minutes: parseInt(e.target.value) || 0})}
                      className="bg-white/20 border-white/30 text-white text-center focus:bg-white/25 transition-all duration-300 focus:scale-105"
                    />
                  </div>
                  <div className="animate-slide-in-right">
                    <label className="block text-sm mb-2 font-medium">{t.seconds}</label>
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      value={countdown.seconds}
                      onChange={(e) => setCountdown({...countdown, seconds: parseInt(e.target.value) || 0})}
                      className="bg-white/20 border-white/30 text-white text-center focus:bg-white/25 transition-all duration-300 focus:scale-105"
                    />
                  </div>
                </div>
                <Button 
                  onClick={startTimer}
                  className="w-full bg-green-600 hover:bg-green-700 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 animate-bounce"
                >
                  {t.start}
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-6 animate-fade-in">
                <div className={`text-5xl font-mono font-bold text-purple-200 tracking-wider p-6 bg-white/10 rounded-2xl transition-all duration-300 ${timeLeft <= 10 && isActive ? 'animate-pulse bg-red-500/20 text-red-200' : ''}`}>
                  {formatTime(timeLeft)}
                </div>
                <div className="flex gap-3">
                  <Button 
                    onClick={pauseTimer}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 animate-slide-in-left"
                  >
                    {isActive ? t.pause : t.start}
                  </Button>
                  <Button 
                    onClick={resetTimer}
                    className="flex-1 bg-red-600 hover:bg-red-700 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 animate-slide-in-right"
                  >
                    {t.reset}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Footer */}
        <footer className="text-center py-12 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 inline-block border border-white/20 shadow-xl hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <p className="text-white/90 flex items-center justify-center gap-2 text-lg font-medium">
              {t.madeWith} <Heart className="w-5 h-5 text-red-400 fill-current animate-pulse" /> {t.by}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
