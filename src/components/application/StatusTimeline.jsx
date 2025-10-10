import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from "../../utils/formatters";
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  XCircle 
} from 'lucide-react';

const StatusTimeline = ({
  applicationData,
  className = '',
}) => {
  if (!applicationData) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="text-center text-gray-500">
          No status information available
        </div>
      </div>
    );
  }

  const {
    status,
    submitted_at,
    approved_at,
    processing_at,
    awaiting_downpayment_at,
    awaiting_delivery_at,
    rejected_at,
    completed_at,
    cancelled_at,
    created_at,
  } = applicationData;

  // Define status timeline steps
  const timelineSteps = [
    {
      key: 'created',
      label: 'Application Created',
      date: created_at,
      status: 'completed',
      icon: CheckCircle,
    },
    {
      key: 'submitted',
      label: 'Application Submitted',
      date: submitted_at,
      status: submitted_at ? 'completed' : (status === 'submitted' ? 'current' : 'pending'),
      icon: CheckCircle,
    },
    {
      key: 'approved',
      label: 'Application Approved',
      date: approved_at,
      status: approved_at ? 'completed' : (status === 'approved' ? 'current' : (status === 'rejected' || status === 'cancelled' ? 'cancelled' : 'pending')),
      icon: CheckCircle,
    },
    {
      key: 'processing',
      label: 'Processing',
      date: processing_at,
      status: processing_at ? 'completed' : (status === 'processing' ? 'current' : 'pending'),
      icon: Clock,
    },
    {
      key: 'awaiting_downpayment',
      label: 'Awaiting Down Payment',
      date: awaiting_downpayment_at,
      status: awaiting_downpayment_at ? 'completed' : (status === 'awaiting_downpayment' ? 'current' : 'pending'),
      icon: Clock,
    },
    {
      key: 'downpayment_paid',
      label: 'Downpayment Paid',
      date: awaiting_downpayment_at, // Use the same timestamp as awaiting_downpayment
      status: awaiting_downpayment_at ? 'completed' : (status === 'awaiting_downpayment' ? 'current' : 'pending'),
      icon: CheckCircle,
    },
    {
      key: 'awaiting_delivery',
      label: 'Awaiting Delivery',
      date: awaiting_delivery_at,
      status: awaiting_delivery_at ? 'completed' : (status === 'awaiting_delivery' ? 'current' : 'pending'),
      icon: Clock,
    },
    {
      key: 'completed',
      label: 'Completed',
      date: completed_at,
      status: completed_at ? 'completed' : (status === 'completed' ? 'current' : 'pending'),
      icon: CheckCircle,
    },
  ];

  // Add rejection/cancellation steps if applicable
  if (rejected_at || status === 'rejected') {
    timelineSteps.push({
      key: 'rejected',
      label: 'Application Rejected',
      date: rejected_at,
      status: 'cancelled',
      icon: XCircle,
    });
  }

  if (cancelled_at || status === 'cancelled') {
    timelineSteps.push({
      key: 'cancelled',
      label: 'Application Cancelled',
      date: cancelled_at,
      status: 'cancelled',
      icon: XCircle,
    });
  }

  const getStepClasses = (stepStatus) => {
    switch (stepStatus) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'current':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-400 bg-gray-50 border-gray-200';
    }
  };

  const getIconClasses = (stepStatus) => {
    switch (stepStatus) {
      case 'completed':
        return 'text-green-600';
      case 'current':
        return 'text-blue-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Application Timeline</h3>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            status === 'completed' ? 'bg-green-100 text-green-800' :
            status === 'approved' ? 'bg-blue-100 text-blue-800' :
            status === 'rejected' || status === 'cancelled' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {status?.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {timelineSteps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === timelineSteps.length - 1;
          
          return (
            <div key={step.key} className="relative">
              {/* Timeline line */}
              {!isLast && (
                <div className="absolute left-4 top-8 w-0.5 h-8 bg-gray-200"></div>
              )}
              
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center ${getStepClasses(step.status)}`}>
                  <Icon className={`w-4 h-4 ${getIconClasses(step.status)}`} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-medium ${
                      step.status === 'completed' ? 'text-green-900' :
                      step.status === 'current' ? 'text-blue-900' :
                      step.status === 'cancelled' ? 'text-red-900' :
                      'text-gray-500'
                    }`}>
                      {step.label}
                    </h4>
                    {step.date && (
                      <span className="text-xs text-gray-500">
                        {formatDate(step.date, 'datetime')}
                      </span>
                    )}
                  </div>
                  
                  {step.status === 'current' && (
                    <p className="text-xs text-blue-600 mt-1">
                      Currently in progress
                    </p>
                  )}
                  
                  {step.status === 'cancelled' && (
                    <p className="text-xs text-red-600 mt-1">
                      This step was cancelled
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Application Duration:</span>
          <span className="font-medium text-gray-900">
            {submitted_at && created_at ? 
              `${Math.ceil((new Date(submitted_at) - new Date(created_at)) / (1000 * 60 * 60 * 24))} days` :
              'N/A'
            }
          </span>
        </div>
      </div>
    </div>
  );
};

StatusTimeline.propTypes = {
  applicationData: PropTypes.shape({
    status: PropTypes.string,
    submitted_at: PropTypes.string,
    approved_at: PropTypes.string,
    processing_at: PropTypes.string,
    awaiting_downpayment_at: PropTypes.string,
    awaiting_delivery_at: PropTypes.string,
    rejected_at: PropTypes.string,
    completed_at: PropTypes.string,
    cancelled_at: PropTypes.string,
    created_at: PropTypes.string,
  }),
  className: PropTypes.string,
};

export default StatusTimeline;
