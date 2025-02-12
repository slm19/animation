"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Folder, Brain, CheckCircle2, FileText, FileImage, FileCode, File } from "lucide-react"
import { useState, useEffect } from "react"

interface UploadAnimationProps {
  fileNames: string[]
  onComplete?: () => void
}

const ANIMATION_TIMINGS = {
  FILE_ANIMATION_DELAY: 400,
  FILE_ANIMATION_DURATION: 1000,
  STUDY_PLAN_START_DELAY: 800,
  STUDY_PLAN_DURATION: 3000,
} as const;

const STAGES = {
  UPLOADING: "uploading",
  PROCESSING: "processing",
  GENERATING: "generating",
  COMPLETE: "complete"
} as const;

type Stage = typeof STAGES[keyof typeof STAGES];

const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'txt':
      return <FileText className="h-6 w-6" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <FileImage className="h-6 w-6" />;
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
      return <FileCode className="h-6 w-6" />;
    default:
      return <File className="h-6 w-6" />;
  }
};

export default function UploadAnimation({ fileNames, onComplete }: UploadAnimationProps) {
  const [showStudyPlan, setShowStudyPlan] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [fileAnimationComplete, setFileAnimationComplete] = useState(false);
  const [studyPlanAnimationStarted, setStudyPlanAnimationStarted] = useState(false);
  const [studyPlanAnimationComplete, setStudyPlanAnimationComplete] = useState(false);
  const [currentStage, setCurrentStage] = useState<Stage>(STAGES.UPLOADING);

  // Calculate total file animation duration based on fixed timings
  const totalFileAnimationDuration = ANIMATION_TIMINGS.FILE_ANIMATION_DURATION;

  useEffect(() => {
    setAnimationStarted(true);
  }, []);

  useEffect(() => {
    if (animationStarted) {
      const timer = setTimeout(() => {
        setFileAnimationComplete(true);
        setShowStudyPlan(true);
        setCurrentStage(STAGES.PROCESSING);
      }, totalFileAnimationDuration);
      return () => clearTimeout(timer);
    }
  }, [animationStarted, totalFileAnimationDuration]);

  useEffect(() => {
    if (showStudyPlan) {
      const timer = setTimeout(() => {
        setStudyPlanAnimationStarted(true);
        setCurrentStage(STAGES.GENERATING);
      }, ANIMATION_TIMINGS.STUDY_PLAN_START_DELAY);
      return () => clearTimeout(timer);
    }
  }, [showStudyPlan]);

  useEffect(() => {
    if (studyPlanAnimationStarted) {
      const timer = setTimeout(() => {
        setStudyPlanAnimationComplete(true);
        setCurrentStage(STAGES.COMPLETE);
      }, ANIMATION_TIMINGS.STUDY_PLAN_DURATION);
      return () => clearTimeout(timer);
    }
  }, [studyPlanAnimationStarted]);

  const getStageText = (stage: Stage) => {
    switch (stage) {
      case STAGES.UPLOADING:
        return "Uploading Documents...";
      case STAGES.PROCESSING:
        return "Processing with AI...";
      case STAGES.GENERATING:
        return "Generating Study Plan...";
      case STAGES.COMPLETE:
        return "Study Plan Ready!";
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="relative h-[600px] w-full max-w-md">
        {/* Central Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Folder and Study Plan Container */}
          <motion.div 
            className="relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Folder */}
            <motion.div
              className="relative z-10"
              animate={showStudyPlan ? { y: -100 } : { y: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <div className="relative bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <Folder 
                  className="h-32 w-32 text-blue-500" 
                  strokeWidth={1.5}
                />
                
                {/* Uploading Files Animation */}
                <AnimatePresence>
                  {animationStarted && !showStudyPlan && fileNames.map((fileName, index) => (
                    <motion.div
                      key={fileName}
                      className="absolute left-0 top-1/2 -translate-y-1/2"
                      initial={{ opacity: 0, x: -200 }}
                      animate={{ 
                        opacity: [0, 1, 1, 0],
                        x: [-200, 0, 0, 50],
                        y: ["-50%", "-50%", "0%", "50%"]
                      }}
                      transition={{
                        duration: 1.2,
                        delay: index * 0.4,
                        times: [0, 0.3, 0.7, 1]
                      }}
                    >
                      <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-md border border-gray-100">
                        {getFileIcon(fileName)}
                        <span className="text-sm text-gray-600 max-w-[150px] truncate">
                          {fileName}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Connection Line */}
            {showStudyPlan && (
              <motion.div 
                className="absolute left-1/2 top-[calc(100%+32px)] -translate-x-1/2 w-1"
                style={{
                  background: "linear-gradient(180deg, #3B82F6 0%, #60A5FA 100%)",
                  boxShadow: "0 0 8px rgba(59, 130, 246, 0.3)"
                }}
                initial={{ height: 0 }}
                animate={{ height: 80 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            )}

            {/* Study Plan */}
            <AnimatePresence>
              {showStudyPlan && (
                <motion.div
                  className="absolute top-[200px] left-1/2 -translate-x-1/2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <motion.div
                    className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 w-96"
                  >
                    {!studyPlanAnimationStarted ? (
                      // Loading state with brain
                      <div className="flex flex-col items-center">
                        <motion.div
                          animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <Brain className="h-16 w-16 text-blue-500" />
                        </motion.div>
                      </div>
                    ) : (
                      // Study plan content
                      <div className="space-y-6">
                        {[1, 2, 3, 4].map((num, index) => (
                          <motion.div 
                            key={num}
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.3 }}
                          >
                            <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                              {num}
                            </div>
                            <div className="flex-1">
                              <div className="h-4 bg-gray-800 rounded-full" />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Completion Check */}
                    {studyPlanAnimationComplete && (
                      <motion.div
                        className="absolute -top-3 -right-3 bg-green-500 rounded-full p-1.5"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                      >
                        <CheckCircle2 className="h-6 w-6 text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}