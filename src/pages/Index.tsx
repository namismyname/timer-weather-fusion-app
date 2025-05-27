
import React, { useState, useEffect } from 'react';
import { Clock, CloudRain, CloudSnow, Cloud, Sun, Timer, Search, Globe, Heart } from 'lucide-react';
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
    by: "by Lovable and ChatGPT"
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
    by: "bởi Lovable và ChatGPT"
  }
};

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('Ho Chi Minh City');
  const [searchCity, setSearchCity] = useState('');
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 5, seconds: 0 });
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [language, setLanguage] = useState('en');

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
    try {
      const API_KEY = 'bd5e378503939ddaee76f12ad7a97608';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      if (response.ok) {
        setWeather(data);
        setCity(cityName);
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
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
        return <CloudRain className="w-12 h-12 text-blue-400" />;
      case 'snow':
        return <CloudSnow className="w-12 h-12 text-blue-200" />;
      case 'clouds':
        return <Cloud className="w-12 h-12 text-gray-400" />;
      default:
        return <Sun className="w-12 h-12 text-yellow-400" />;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800 p-4">
      {/* Language Selector */}
      <div className="fixed top-4 right-4 z-10">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-20 bg-white/10 backdrop-blur-md border-white/20 text-white">
            <Globe className="w-4 h-4" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">EN</SelectItem>
            <SelectItem value="vi">VI</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Multi-Function Timer
          </h1>
          <p className="text-xl text-white/80">Clock • Weather • Countdown</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Current Time */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 text-white">
            <div className="flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 mr-2 text-blue-400" />
              <h2 className="text-2xl font-bold">{t.currentTime}</h2>
            </div>
            <div className="text-center">
              <div className="text-4xl font-mono font-bold mb-2">
                {currentTime.toLocaleTimeString('en-US', { 
                  hour12: false,
                  timeZone: 'Asia/Ho_Chi_Minh'
                })}
              </div>
              <div className="text-lg text-white/80">
                {currentTime.toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  timeZone: 'Asia/Ho_Chi_Minh'
                })}
              </div>
            </div>
          </Card>

          {/* Weather */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 text-white">
            <div className="flex items-center justify-center mb-4">
              <CloudRain className="w-8 h-8 mr-2 text-blue-400" />
              <h2 className="text-2xl font-bold">{t.weather}</h2>
            </div>
            
            <div className="flex gap-2 mb-4">
              <Input
                placeholder={t.searchCity}
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCitySearch()}
                className="bg-white/20 border-white/30 text-white placeholder-white/60"
              />
              <Button 
                onClick={handleCitySearch}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Search className="w-4 h-4" />
              </Button>
            </div>

            {weather && (
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {getWeatherIcon(weather.weather[0].main)}
                </div>
                <h3 className="text-xl font-bold mb-2">{weather.name}</h3>
                <div className="text-3xl font-bold mb-4">{Math.round(weather.main.temp)}°C</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{t.humidity}:</span>
                    <span>{weather.main.humidity}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.windSpeed}:</span>
                    <span>{weather.wind.speed} m/s</span>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Countdown Timer */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20 p-6 text-white">
            <div className="flex items-center justify-center mb-4">
              <Timer className="w-8 h-8 mr-2 text-purple-400" />
              <h2 className="text-2xl font-bold">{t.countdownTimer}</h2>
            </div>

            {!isActive && timeLeft === 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">{t.setTimer}</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm mb-1">{t.hours}</label>
                    <Input
                      type="number"
                      min="0"
                      max="23"
                      value={countdown.hours}
                      onChange={(e) => setCountdown({...countdown, hours: parseInt(e.target.value) || 0})}
                      className="bg-white/20 border-white/30 text-white text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">{t.minutes}</label>
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      value={countdown.minutes}
                      onChange={(e) => setCountdown({...countdown, minutes: parseInt(e.target.value) || 0})}
                      className="bg-white/20 border-white/30 text-white text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">{t.seconds}</label>
                    <Input
                      type="number"
                      min="0"
                      max="59"
                      value={countdown.seconds}
                      onChange={(e) => setCountdown({...countdown, seconds: parseInt(e.target.value) || 0})}
                      className="bg-white/20 border-white/30 text-white text-center"
                    />
                  </div>
                </div>
                <Button 
                  onClick={startTimer}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {t.start}
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="text-4xl font-mono font-bold">
                  {formatTime(timeLeft)}
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={pauseTimer}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700"
                  >
                    {isActive ? t.pause : t.start}
                  </Button>
                  <Button 
                    onClick={resetTimer}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    {t.reset}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Footer */}
        <footer className="text-center py-8">
          <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 inline-block border border-white/20">
            <p className="text-white/80 flex items-center justify-center gap-2">
              {t.madeWith} <Heart className="w-4 h-4 text-red-400 fill-current" /> {t.by}
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
