import { ShieldCheck, Lock, Zap, Heart } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    iconColor: 'text-red-600 dark:text-red-500',
    iconBg: 'bg-red-50 dark:bg-red-500/10',
    title: 'Works in Browser',
    subtitle: 'No software installation needed',
  },
  {
    icon: Lock,
    iconColor: 'text-red-600 dark:text-red-500',
    iconBg: 'bg-red-50 dark:bg-red-500/10',
    title: 'Your Files Stay Private',
    subtitle: 'Files are processed locally',
  },
  {
    icon: Zap,
    iconColor: 'text-red-600 dark:text-red-500',
    iconBg: 'bg-red-50 dark:bg-red-500/10',
    title: 'Super Fast',
    subtitle: 'Get results in seconds',
  },
  {
    icon: Heart,
    iconColor: 'text-red-600 dark:text-red-500',
    iconBg: 'bg-red-50 dark:bg-red-500/10',
    title: 'Free to Use',
    subtitle: 'No registration required',
    fill: true,
  },
];

export default function FeatureBar() {
  return (
    <section className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0B1221] py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-4">
          {TRUST_ITEMS.map((item, i) => (
            <div key={i} className="group flex items-center gap-4 justify-start sm:justify-center px-2 cursor-default">
              <div className={`shrink-0 rounded-2xl p-3 ${item.iconBg} ${item.iconColor} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                <item.icon
                  className="h-6 w-6"
                  fill={item.fill ? "currentColor" : "none"}
                  strokeWidth={2}
                />
              </div>

              <div>
                <p className="text-[15px] font-bold text-gray-900 dark:text-gray-100 leading-tight group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                  {item.title}
                </p>
                <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}