// stores/stats.js
import { defineStore } from 'pinia'
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns'
import { routine } from '@/stores/routine'
import { exercises } from '@/stores/exercise'
import { ko } from 'date-fns/locale'  // 한국어 요일 표시

export const useStatsStore = defineStore('stats', {
    state: () => ({
        weeklyProgress: [],
        topParts: [],
        monthlyStats: {
          workoutDays: 0,
          achievementRate: 0
        },
        isLoading: false,
        error: null
    }),

    actions: {
    // 1. 주간 운동 현황 계산
    async getWeeklyProgress(selectedDate, userId) {
      try {
        this.isLoading = true
        console.log('주간 데이터 로드 시작:', { selectedDate, userId })

        const start = startOfWeek(selectedDate, { weekStartsOn: 1 })
        const end = endOfWeek(selectedDate, { weekStartsOn: 1 })
        const weekDays = eachDayOfInterval({ start, end })
        
        const progressData = await Promise.all(
            weekDays.map(async (date) => {
              const formattedDate = format(date, 'yyyy-MM-dd')  // 정확한 날짜 형식 사용
                  
              // 루틴 개수 조회
              const [totalCount, completedCount] = await Promise.all([
                routine.getRoutineCount(userId, formattedDate),
                routine.getCompletedRoutineCount(userId, formattedDate)
              ])
              
              console.log('날짜별 데이터:', {
                date: formattedDate,
                total: totalCount,
                completed: completedCount
              })
      
              const progressRate = totalCount > 0 
                ? Math.round((completedCount / totalCount) * 100)
                : 0
      
              return {
                date: format(date, 'EEE', { locale: ko }), // 요일 표시
                progressRate
              }
            })
          )
      
          this.weeklyProgress = progressData
          return progressData
        } catch (error) {
          console.error('주간 운동 현황 조회 실패:', error)
          this.error = error.message
          throw error
        } finally {
          this.isLoading = false
        }
    },

    // 2. 오늘의 득근 부위 분석
    async getTopExerciseParts(selectedDate, userId) {
        try {
            const formattedDate = format(selectedDate, 'yyyy-MM-dd')
            
            // 1. 선택된 날짜의 루틴 조회
            const dailyRoutines = await routine.getRoutinesByDate(userId, formattedDate)
            console.log('조회된 일일 루틴:', dailyRoutines)
    
            if (!dailyRoutines || dailyRoutines.length === 0) {
              this.topParts = []
              return []
            }
    
            // 2. 모든 운동 정보 조회
            const exerciseList = await exercises.getAllExercises()
            console.log('전체 운동 목록:', exerciseList)
    
            // 3. exercisesId를 키로 하는 Map 생성
            const exerciseMap = new Map(
              exerciseList.map(exercise => [exercise.exercisesId, exercise.part])
            )
    
            // 4. 부위별 카운트
            const partCounts = {}
            dailyRoutines.forEach(routine => {
              const part = exerciseMap.get(routine.exercisesId)
              if (part) {
                partCounts[part] = (partCounts[part] || 0) + 1
              }
            })
            
            console.log('부위별 카운트:', partCounts)
    
            // 5. 가장 많은 카운트를 가진 부위(들) 찾기
            if (Object.keys(partCounts).length === 0) {
              this.topParts = []
              return []
            }
    
            const maxCount = Math.max(...Object.values(partCounts))
            const topParts = Object.entries(partCounts)
              .filter(([_, count]) => count === maxCount)
              .map(([part]) => part)
    
            console.log('최다 빈도 부위:', topParts)
            
            this.topParts = topParts
            return topParts
        } catch (error) {
            console.error('운동 부위 분석 실패:', error)
            throw error
        }
    },

    // 3. 이달의 기록 계산
    async getMonthlyStats(selectedDate, userId) {
      try {
        this.isLoading = true
        const year = selectedDate.getFullYear()
        const month = selectedDate.getMonth() + 1
        
        const monthlyRoutines = await routine.getRoutinesByMonth(userId, year, month)
        
        if (!monthlyRoutines || monthlyRoutines.length === 0) {
          const stats = { workoutDays: 0, achievementRate: 0 }
          this.monthlyStats = stats
          return stats
        }

        const uniqueDates = new Set(
          monthlyRoutines.map(routine => routine.exerciseDate)
        )
        const workoutDays = uniqueDates.size

        const totalRoutines = monthlyRoutines.length
        const completedRoutines = monthlyRoutines.filter(
          routine => routine.isCompleted === 1
        ).length
        
        const stats = {
          workoutDays,
          achievementRate: totalRoutines > 0 
            ? Math.round((completedRoutines / totalRoutines) * 100) 
            : 0
        }

        this.monthlyStats = stats
        return stats
      } catch (error) {
        console.error('월간 통계 조회 실패:', error)
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // 모든 통계 한 번에 로드
    async loadAllStats(selectedDate, userId) {
      try {
        this.isLoading = true
        this.error = null
        console.log('통계 데이터 로드 시작:', { selectedDate, userId })

        await Promise.all([
          this.getWeeklyProgress(selectedDate, userId),
          this.getTopExerciseParts(selectedDate, userId),
          this.getMonthlyStats(selectedDate, userId)
        ])
      } catch (error) {
        console.error('통계 데이터 로드 실패:', error)
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    }
  }
})