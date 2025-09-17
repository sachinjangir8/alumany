import React from 'react';
import {
    HelpCircle,
    Users,
    Building,
    Calendar,
    Award,
    CheckCircle,
    Info,
    Mail,
    Phone,
    AlertCircle,
    GraduationCap,
    MapPin,
    Download,
    Bell,
    ChevronDown,
    ChevronLeft,
    ChevronUp,
    ArrowLeft,
    Home,
    MessageCircle,
    Clock,
    ChevronRight,
    Star,
    Linkedin,
    Globe,
    Tag,
    ExternalLink,
    MoreHorizontal,
    Play,
    Share2,
    FileX,
    Shield,
    ArrowRight,
    UserPlus,
    Filter,
    IndianRupee,
    Eye,
    Edit,
    Send,
    X,
    Briefcase,
    User,
    Settings,
    Search,
    LogOut,
    Check,
} from 'lucide-react';

const ICONS = {
    HelpCircle,
    Users,
    Building,
    Calendar,
    Award,
    CheckCircle,
    Info,
    Mail,
    Phone,
    AlertCircle,
    GraduationCap,
    MapPin,
    Download,
    Bell,
    ChevronDown,
    ChevronLeft,
    ChevronUp,
    ArrowLeft,
    Home,
    MessageCircle,
    Clock,
    ChevronRight,
    Star,
    Linkedin,
    Globe,
    Tag,
    ExternalLink,
    MoreHorizontal,
    Play,
    Share2,
    FileX,
    Shield,
    ArrowRight,
    UserPlus,
    Filter,
    IndianRupee,
    Eye,
    Edit,
    Send,
    X,
    Briefcase,
    User,
    Settings,
    Search,
    LogOut,
    Check,
};

function Icon({
    name,
    size = 24,
    color = "currentColor",
    className = "",
    strokeWidth = 2,
    ...props
}) {
    const IconComponent = ICONS?.[name];

    if (!IconComponent) {
        return <HelpCircle size={size} color="gray" strokeWidth={strokeWidth} className={className} {...props} />;
    }

    return <IconComponent
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        className={className}
        {...props}
    />;
}
export default Icon;