import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { FileUpload } from '../components/ui/FileUpload';
import { Checkbox } from '../components/ui/Checkbox';
import { Award, Star, Users, Heart, Shield, Target } from 'lucide-react';
import { NominationFormData, CoreValue } from '../types';
import { MockAPI } from '../utils/mockApi';

const coreValueOptions = [
  { 
    value: 'customer_delight' as CoreValue, 
    label: 'Customer Delight',
    icon: <Heart className="h-4 w-4" />,
    description: 'Goes above and beyond to ensure customer satisfaction'
  },
  { 
    value: 'innovation' as CoreValue, 
    label: 'Innovation',
    icon: <Star className="h-4 w-4" />,
    description: 'Brings creative solutions and new ideas to challenges'
  },
  { 
    value: 'team_work' as CoreValue, 
    label: 'Team Work',
    icon: <Users className="h-4 w-4" />,
    description: 'Collaborates effectively and supports team members'
  },
  { 
    value: 'being_fair' as CoreValue, 
    label: 'Being Fair',
    icon: <Shield className="h-4 w-4" />,
    description: 'Demonstrates integrity and treats everyone equitably'
  },
  { 
    value: 'ownership' as CoreValue, 
    label: 'Ownership',
    icon: <Target className="h-4 w-4" />,
    description: 'Takes responsibility and drives results proactively'
  },
];

export function SubmitNomination() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCoreValues, setSelectedCoreValues] = useState<CoreValue[]>([]);
  const [supportingFiles, setSupportingFiles] = useState<File[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<NominationFormData>();

  const awardType = watch('awardType');

  const onSubmit = async (data: NominationFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call to submit nomination
      await MockAPI.submitNomination({
        ...data,
        coreValues: selectedCoreValues,
        supportingDocuments: supportingFiles,
      });
      
      setSubmitSuccess(true);
      reset();
      setSelectedCoreValues([]);
      setSupportingFiles([]);
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Failed to submit nomination:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCoreValueChange = (value: CoreValue, checked: boolean) => {
    if (checked) {
      setSelectedCoreValues(prev => [...prev, value]);
    } else {
      setSelectedCoreValues(prev => prev.filter(v => v !== value));
    }
  };

  const getRatingLabel = (rating: number) => {
    const labels = {
      1: 'Poor',
      2: 'Below Average',
      3: 'Average',
      4: 'Good',
      5: 'Excellent'
    };
    return labels[rating as keyof typeof labels] || '';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Submit Nomination
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Nominate an outstanding team member for recognition
        </p>
      </div>

      {/* Success Message */}
      {submitSuccess && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
          <div className="flex items-center space-x-3">
            <Award className="h-6 w-6 text-green-600 dark:text-green-400" />
            <div>
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-400">
                Nomination Submitted Successfully!
              </h3>
              <p className="text-green-700 dark:text-green-300">
                Your nomination has been submitted and will be reviewed by the awards committee.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Nomination Form */}
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Resource Name *"
                {...register('resourceName', { 
                  required: 'Resource name is required' 
                })}
                error={errors.resourceName?.message}
                placeholder="Enter the nominee's full name"
              />
              
              <Select
                label="Award Type *"
                {...register('awardType', { 
                  required: 'Award type is required' 
                })}
                options={[
                  { value: '', label: 'Select award type' },
                  { value: 'monthly', label: 'Monthly Award' },
                  { value: 'quarterly', label: 'Quarterly Award' },
                  { value: 'yearly', label: 'Yearly Award' },
                ]}
                error={errors.awardType?.message}
              />
              
              <Input
                label="Project Aligned with (Delivery Team only)"
                {...register('projectAligned')}
                placeholder="Enter project name if applicable"
                hint="Only required for delivery team members"
              />
            </div>
          </div>

          {/* Nomination Details */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Nomination Details
            </h2>
            <div className="space-y-6">
              <Textarea
                label="Verbiage for Nomination *"
                {...register('verbiage', { 
                  required: 'Nomination description is required',
                  minLength: {
                    value: 50,
                    message: 'Please provide at least 50 characters'
                  }
                })}
                error={errors.verbiage?.message}
                placeholder="Describe why this person deserves recognition. Include specific examples of their contributions, achievements, and impact..."
                rows={6}
                hint="Minimum 50 characters. Be specific about achievements and impact."
              />
              
              <Textarea
                label="Supporting Acknowledgement (Adds Value) *"
                {...register('supportingAcknowledgement', { 
                  required: 'Supporting acknowledgement is required' 
                })}
                error={errors.supportingAcknowledgement?.message}
                placeholder="Provide additional context, client feedback, or specific examples that support this nomination..."
                rows={4}
                hint="Include any client feedback, peer recognition, or measurable outcomes"
              />
            </div>
          </div>

          {/* Core Values Alignment */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Core Values Alignment *
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Select which core values your nominee exemplifies (select all that apply):
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coreValueOptions.map((option) => (
                <Card key={option.value} padding="sm" className="hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={selectedCoreValues.includes(option.value)}
                      onChange={(e) => handleCoreValueChange(option.value, e.target.checked)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        {option.icon}
                        <span className="font-medium text-gray-900 dark:text-white">
                          {option.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {selectedCoreValues.length === 0 && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                Please select at least one core value
              </p>
            )}
          </div>

          {/* Overall Rating */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Overall Rating *
            </h2>
            <div className="space-y-4">
              <Select
                label="Overall Rating for Your Nominee"
                {...register('overallRating', { 
                  required: 'Overall rating is required',
                  valueAsNumber: true,
                  min: { value: 1, message: 'Please select a rating' }
                })}
                options={[
                  { value: '', label: 'Select rating' },
                  { value: '5', label: '5 - Excellent' },
                  { value: '4', label: '4 - Good' },
                  { value: '3', label: '3 - Average' },
                  { value: '2', label: '2 - Below Average' },
                  { value: '1', label: '1 - Poor' },
                ]}
                error={errors.overallRating?.message}
              />
              
              {watch('overallRating') && (
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= Number(watch('overallRating'))
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {getRatingLabel(Number(watch('overallRating')))}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Supporting Documents */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Supporting Documents
            </h2>
            <FileUpload
              label="Upload Supporting Documents"
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.gif"
              multiple={true}
              maxSize={10}
              files={supportingFiles}
              onFilesChange={setSupportingFiles}
              hint="Upload emails, Slack messages, client feedback, or other documents that support this nomination. Accepted formats: PDF, DOC, DOCX, TXT, PNG, JPG, GIF (max 10MB each)"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setSelectedCoreValues([]);
                setSupportingFiles([]);
              }}
            >
              Reset Form
            </Button>
            <Button
              type="submit"
              isLoading={isSubmitting}
              disabled={selectedCoreValues.length === 0}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Nomination'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}