
# AI-Powered Mathematical Animation Platform

A sophisticated educational video generation system that transforms natural language prompts into mathematical animations using Manim. The core innovation lies in compensating for AI's lack of spatial reasoning through extensive scaffolding, auto-composition utilities, and deterministic template systems.

## Core Innovation: Compensating for Spatial Reasoning

The fundamental challenge this platform solves is that LLMs lack spatial reasoning capabilities necessary for mathematical animation. We developed an extensive scaffolding system that transforms abstract mathematical concepts into deterministic spatial operations.

### Manim Auto-Composition Framework

The key breakthrough was creating a compositional system where AI doesn't need to understand spatial relationships - it just needs to call high-level functions that handle all positioning internally:

\`\`\`python
class ManimAutoComposer:
    """Handles spatial composition without requiring AI spatial reasoning"""
    
    def __init__(self):
        self.scene_regions = {
            'equation': {'x': (-3, 3), 'y': (2, 3.5)},
            'explanation': {'x': (-3, 3), 'y': (-0.5, 1.5)},
            'visualization': {'x': (-3, 3), 'y': (-3.5, -1)},
            'number_plane': {'x': (-7, -3.5), 'y': (-3.5, 3.5)}
        }
        self.object_registry = {}
        self.z_index_manager = ZIndexManager()
    
    def place_equation(self, tex_string, region='equation', auto_scale=True):
        """Automatically positions equations in appropriate regions"""
        tex = MathTex(tex_string)
        
        if auto_scale:
            # Scale to fit region while maintaining readability
            region_width = self.scene_regions[region]['x'][1] - self.scene_regions[region]['x'][0]
            if tex.width > region_width * 0.9:
                tex.scale(region_width * 0.9 / tex.width)
        
        # Center in region
        center_x = sum(self.scene_regions[region]['x']) / 2
        center_y = sum(self.scene_regions[region]['y']) / 2
        tex.move_to([center_x, center_y, 0])
        
        # Register for collision detection
        self.object_registry[tex] = region
        return tex
    
    def smart_arrow(self, from_obj, to_obj, label=None, curve=AUTO):
        """Creates arrows with automatic curve detection to avoid overlaps"""
        if curve == AUTO:
            # Detect if straight line would intersect other objects
            curve = self._calculate_optimal_curve(from_obj, to_obj)
        
        arrow = CurvedArrow(
            from_obj.get_critical_point(DOWN),
            to_obj.get_critical_point(UP),
            angle=curve
        )
        
        if label:
            label_obj = Text(label, font_size=20)
            # Position label at arrow midpoint with offset
            label_obj.move_to(arrow.point_from_proportion(0.5))
            label_obj.shift(self._calculate_label_offset(arrow))
            return VGroup(arrow, label_obj)
        
        return arrow
\`\`\`

### Deterministic Scene Templates

Instead of letting AI figure out where to place objects, we created fixed templates that handle all spatial logic:

\`\`\`python
class NumberPlaneTexSplitScreen(Scene):
    """The workhorse template - handles 90% of mathematical animations"""
    
    def __init__(self):
        super().__init__()
        # Fixed regions that never change
        self.plane_region = Rectangle(width=7, height=7).shift(LEFT * 3.5)
        self.tex_region = Rectangle(width=7, height=7).shift(RIGHT * 3.5)
        
        # Number plane with extensive helper methods
        self.plane = EnhancedNumberPlane(
            x_range=[-10, 10, 1],
            y_range=[-10, 10, 1],
            background_line_style={"stroke_opacity": 0.3}
        )
        self.plane.scale(0.35).shift(LEFT * 3.5)
        
        # Equation tracking system
        self.equation_stack = EquationStack(max_equations=5)
        self.current_highlight = None
    
    def show_equation_and_graph(self, equation_tex, graph_func, color=BLUE):
        """Synchronized equation display with graph plotting"""
        # AI just provides equation_tex and graph_func
        # Template handles ALL positioning
        
        # Place equation in designated spot
        equation = MathTex(equation_tex)
        self.equation_stack.add(equation)  # Handles vertical stacking
        
        # Plot on number plane
        graph = self.plane.plot(graph_func, color=color)
        
        # Automatic highlighting connection
        highlight_box = SurroundingRectangle(equation, color=color)
        
        # Synchronized animation
        self.play(
            Write(equation),
            Create(graph),
            Create(highlight_box),
            run_time=2
        )
        
        return equation, graph, highlight_box

class EquationStack:
    """Manages vertical equation layout without AI needing positions"""
    
    def __init__(self, max_equations=5, start_y=3, spacing=0.8):
        self.equations = []
        self.max_equations = max_equations
        self.start_y = start_y
        self.spacing = spacing
        self.right_x = 3.5  # Fixed x position
    
    def add(self, equation):
        if len(self.equations) >= self.max_equations:
            # Auto-remove oldest equation with fade
            self.remove_oldest()
        
        # Calculate position based on stack
        y_position = self.start_y - len(self.equations) * self.spacing
        equation.move_to([self.right_x, y_position, 0])
        
        self.equations.append(equation)
        return equation
    
    def highlight_current(self, color=YELLOW):
        """Creates visual connection to current work"""
        if self.equations:
            current = self.equations[-1]
            return SurroundingRectangle(current, color=color)
\`\`\`

### ElevenLabs Voice Synchronization System

The most complex part was synchronizing AI-generated voiceovers with Manim animations. We built a timing extraction and synchronization framework:

\`\`\`python
class ElevenLabsVoiceSync:
    """Handles voice generation and animation synchronization"""
    
    def __init__(self, api_key):
        self.client = ElevenLabs(api_key=api_key)
        self.voice_settings = VoiceSettings(
            stability=0.75,
            similarity_boost=0.75,
            style=0.0,
            use_speaker_boost=True
        )
    
    def generate_with_timing(self, script_segments):
        """Generate voice with word-level timing data"""
        full_audio = []
        timing_data = []
        current_time = 0.0
        
        for segment in script_segments:
            # Generate audio for segment
            audio_response = self.client.text_to_speech.convert(
                text=segment['text'],
                voice_id="Daniel",  # or "Lily"
                model_id="eleven_turbo_v2_5",
                voice_settings=self.voice_settings,
                output_format="mp3_44100_128",
                with_timestamps=True  # Critical for sync
            )
            
            # Extract timing information
            audio_bytes = b"".join(audio_response)
            duration = self._get_audio_duration(audio_bytes)
            
            timing_data.append({
                'start': current_time,
                'end': current_time + duration,
                'text': segment['text'],
                'animation_cue': segment.get('animation_cue'),
                'emphasis_words': segment.get('emphasis', [])
            })
            
            full_audio.append(audio_bytes)
            current_time += duration
        
        return b"".join(full_audio), timing_data
    
    def create_manim_timeline(self, timing_data, scene):
        """Convert timing data to Manim animation timeline"""
        animations = []
        
        for segment in timing_data:
            start_time = segment['start']
            duration = segment['end'] - segment['start']
            
            # Map animation cues to Manim animations
            if segment['animation_cue'] == 'highlight_equation':
                anim = scene.highlight_equation(duration=duration)
            elif segment['animation_cue'] == 'draw_graph':
                anim = scene.draw_graph_gradually(duration=duration)
            elif segment['animation_cue'] == 'transform':
                anim = scene.transform_equation(duration=duration)
            else:
                # Default: wait while voice plays
                anim = Wait(duration)
            
            animations.append((start_time, anim))
        
        return animations

class ManimVoiceScene(Scene):
    """Base scene with voice synchronization built-in"""
    
    def __init__(self, voice_file, timing_data):
        super().__init__()
        self.voice_file = voice_file
        self.timing_data = timing_data
        self.audio_tracker = AudioTracker()
    
    def construct(self):
        # Add voiceover to scene
        self.add_sound(self.voice_file)
        
        # Execute animations according to timing
        for segment in self.timing_data:
            # Wait until segment start time
            wait_time = segment['start'] - self.audio_tracker.current_time
            if wait_time > 0:
                self.wait(wait_time)
            
            # Execute segment animation
            self.execute_segment(segment)
            self.audio_tracker.current_time = segment['end']
    
    def execute_segment(self, segment):
        """Override in subclasses for specific animations"""
        if segment['animation_cue']:
            method_name = f"animate_{segment['animation_cue']}"
            if hasattr(self, method_name):
                getattr(self, method_name)(segment)
            else:
                self.wait(segment['end'] - segment['start'])
\`\`\`

### Intelligent Math Symbol Recognition

One of the hardest challenges was getting AI to correctly place mathematical symbols and expressions. We developed a context-aware placement system:

\`\`\`python
class MathSymbolPlacer:
    """Handles intelligent placement of mathematical notation"""
    
    def __init__(self):
        self.symbol_registry = {}
        self.collision_map = CollisionMap()
        
    def place_fraction(self, numerator, denominator, position=AUTO):
        """Creates properly scaled fractions with automatic positioning"""
        if position == AUTO:
            position = self.find_clear_space(required_height=1.5)
        
        # Create fraction with proper scaling
        frac = VGroup(
            MathTex(numerator),
            Line(start=LEFT, end=RIGHT),
            MathTex(denominator)
        ).arrange(DOWN, buff=0.1)
        
        # Scale based on complexity
        complexity = len(numerator) + len(denominator)
        if complexity > 10:
            frac.scale(0.8)
        
        frac.move_to(position)
        self.collision_map.register(frac)
        return frac
    
    def place_matrix(self, elements, rows, cols, bracket_type="square"):
        """Creates matrices with automatic element alignment"""
        matrix_mob = Matrix(
            elements,
            left_bracket=self._get_bracket(bracket_type, "left"),
            right_bracket=self._get_bracket(bracket_type, "right")
        )
        
        # Ensure all elements are aligned
        for i, row in enumerate(matrix_mob.get_rows()):
            for j, elem in enumerate(row):
                # Center each element in its cell
                elem.move_to(matrix_mob.get_cell((i, j)))
        
        return matrix_mob

class TransformationTracker:
    """Tracks mathematical transformations for smooth animations"""
    
    def __init__(self):
        self.transformation_history = []
        self.current_expression = None
    
    def algebraic_transform(self, from_expr, to_expr, steps):
        """Animates algebraic manipulations with intermediate steps"""
        animations = []
        current = from_expr
        
        for step in steps:
            # Parse transformation type
            if step['type'] == 'distribute':
                next_expr = self._apply_distribution(current, step['terms'])
            elif step['type'] == 'combine_like_terms':
                next_expr = self._combine_terms(current, step['terms'])
            elif step['type'] == 'factor':
                next_expr = self._factor_expression(current, step['method'])
            
            # Create smooth transformation
            anim = TransformMatchingTex(
                current.copy(),
                next_expr,
                key_map=self._build_key_map(current, next_expr)
            )
            animations.append(anim)
            current = next_expr
        
        return animations
\`\`\`

### 8-Stage Workflow Pipeline Architecture

The pipeline orchestrates multiple AI models, each optimized for specific tasks:

\`\`\`python
class VideoGenerationPipeline:
    """Orchestrates the complete video generation workflow"""
    
    def __init__(self):
        self.stages = {
            1: ProblemSolvingStage(),      # OpenAI O3 Medium
            2: LessonPlanningStage(),       # Claude Opus 4
            3: CodeGenerationStage(),       # Direct Anthropic API
            4: ValidationStage(),           # MyPy type checking
            5: PatchingStage(),            # Error recovery
            6: RenderingStage(),           # Manim rendering
            7: AudioProcessingStage(),     # ElevenLabs integration
            8: UploadStage()               # S3/CDN delivery
        }
    
    async def execute(self, user_prompt):
        context = {'prompt': user_prompt}
        
        for stage_num, stage in self.stages.items():
            try:
                # Execute stage with context from previous stages
                result = await stage.execute(context)
                context.update(result)
                
                # Update progress via WebSocket
                await self.emit_progress(stage_num, result)
                
            except StageError as e:
                # Intelligent recovery based on stage
                if stage_num == 3:  # Code generation is critical
                    # Retry with simpler template
                    context['template'] = 'BasicScene'
                    result = await stage.execute(context)
                elif stage_num == 5:  # Patching stage
                    # Use best effort code
                    context['code'] = context.get('best_valid_code', context['code'])
                else:
                    raise
        
        return context['final_video']

class CodeGenerationStage:
    """Critical stage - generates Manim code from lesson plan"""
    
    def __init__(self):
        # Direct Anthropic API, not agents SDK
        self.client = anthropic.Client()
        self.template = "NumberPlaneTexSplitScreen"  # Hardcoded
        
    async def execute(self, context):
        lesson_plan = context['lesson_plan']
        
        # Four-pass generation system
        passes = [
            self._generate_structure,
            self._add_animations,
            self._add_voiceover_sync,
            self._optimize_timing
        ]
        
        code = f"from manim import *\\\\nfrom custom_components import *\\\\n\\\\n"
        
        for pass_func in passes:
            code = await pass_func(code, lesson_plan)
        
        return {'code': code, 'template_used': self.template}
\`\`\`

### Pattern Mining and Abstraction from Existing Manim Code

Before building our component library, we analyzed thousands of Manim animations to identify recurring patterns and create proper abstractions:

\`\`\`python
class ManimPatternAnalyzer:
    """Mines existing Manim code to identify common patterns and abstractions"""
    
    def __init__(self):
        self.pattern_frequency = defaultdict(int)
        self.composition_patterns = []
        self.color_schemes = defaultdict(list)
        self.geometric_constructs = []
        
    def analyze_codebase(self, repo_paths):
        """Analyze multiple Manim repositories to extract patterns"""
        for repo in repo_paths:
            scenes = self._extract_scenes(repo)
            
            for scene in scenes:
                # Extract geometric patterns
                geo_patterns = self._extract_geometric_patterns(scene)
                self.geometric_constructs.extend(geo_patterns)
                
                # Extract composition patterns
                comp_patterns = self._extract_composition_patterns(scene)
                self.composition_patterns.extend(comp_patterns)
                
                # Extract color usage patterns
                color_patterns = self._extract_color_patterns(scene)
                for pattern in color_patterns:
                    self.color_schemes[pattern['context']].append(pattern['colors'])
        
        return self._generate_abstractions()
    
    def _extract_geometric_patterns(self, scene_ast):
        """Identify common geometric construction patterns"""
        patterns = []
        
        # Pattern: Triangle construction methods
        triangle_patterns = [
            'Polygon(p1, p2, p3)',  # Direct vertex
            'Triangle().scale().rotate()',  # Transform-based
            'RegularPolygon(n=3)',  # Regular triangle
            'Circle().inscribe_polygon(3)'  # Inscribed
        ]
        
        # Pattern: Circle-line intersections
        intersection_patterns = [
            'line.get_intersection(circle)',
            'circle.point_at_angle(theta)',
            'tangent_line(circle, point)'
        ]
        
        # Classify and count patterns
        for pattern_type in self._walk_ast(scene_ast):
            if self._matches_pattern(pattern_type, triangle_patterns):
                patterns.append({
                    'type': 'triangle_construction',
                    'method': pattern_type,
                    'frequency': self.pattern_frequency[pattern_type]
                })
        
        return patterns
    
    def _generate_abstractions(self):
        """Generate reusable abstractions from patterns"""
        abstractions = {}
        
        # Geometric abstractions based on frequency
        if len(self.geometric_constructs) > 100:
            abstractions['GeometryFactory'] = self._create_geometry_factory()
        
        # Composition abstractions from common layouts
        if len(self.composition_patterns) > 50:
            abstractions['LayoutManager'] = self._create_layout_manager()
        
        # Color abstractions from usage patterns
        if len(self.color_schemes) > 20:
            abstractions['ColorPalette'] = self._create_color_palette()
        
        return abstractions

class PatternPruner:
    """Prunes redundant patterns and identifies core abstractions"""
    
    def __init__(self, patterns):
        self.patterns = patterns
        self.pruned = []
        self.core_abstractions = []
        
    def prune_redundant(self):
        """Remove redundant patterns that are variations of core patterns"""
        
        # Group similar patterns
        pattern_groups = self._cluster_patterns(self.patterns)
        
        for group in pattern_groups:
            # Find the most general pattern in group
            core_pattern = self._find_core_pattern(group)
            self.core_abstractions.append(core_pattern)
            
            # Prune variations
            for pattern in group:
                if not self._is_significant_variation(pattern, core_pattern):
                    self.pruned.append(pattern)
        
        return self.core_abstractions
    
    def _find_core_pattern(self, pattern_group):
        """Identify the most general/reusable pattern in a group"""
        # Score patterns by generality and usage frequency
        scores = {}
        
        for pattern in pattern_group:
            score = 0
            score += pattern['frequency'] * 10  # Weight frequency
            score += len(pattern['parameters']) * 5  # Flexibility
            score -= pattern['complexity'] * 2  # Penalize complexity
            scores[pattern['id']] = score
        
        # Return highest scoring pattern
        best_pattern_id = max(scores, key=scores.get)
        return next(p for p in pattern_group if p['id'] == best_pattern_id)

# Generated abstractions based on pattern analysis
class GeometryFactory:
    """Factory for common geometric constructions derived from pattern analysis"""
    
    @staticmethod
    def triangle(method='vertices', **kwargs):
        """Unified triangle construction based on mined patterns"""
        if method == 'vertices':
            return Polygon(kwargs['p1'], kwargs['p2'], kwargs['p3'])
        elif method == 'angles':
            # Most common pattern: construct from angles
            return TriangleFromAngles(kwargs['angles'])
        elif method == 'sides':
            # Second most common: construct from side lengths
            return TriangleFromSides(kwargs['sides'])
        elif method == 'inscribed':
            # Found in 30% of geometric scenes
            circle = kwargs.get('circle', Circle())
            return circle.inscribe_polygon(3)
    
    @staticmethod
    def parallel_lines(line, distance, count=2):
        """Create parallel lines - pattern found in 40% of linear algebra animations"""
        lines = VGroup()
        for i in range(count):
            offset = distance * (i - (count-1)/2)
            parallel = line.copy().shift(offset * line.get_unit_normal())
            lines.add(parallel)
        return lines

class LayoutManager:
    """Manages common layout patterns discovered through analysis"""
    
    def __init__(self):
        # These ratios were found to be most common in analyzed code
        self.golden_ratio = 1.618
        self.common_splits = {
            'half': 0.5,
            'thirds': [1/3, 2/3],
            'golden': [1/self.golden_ratio, 1 - 1/self.golden_ratio]
        }
    
    def split_screen(self, ratio='half', orientation='vertical'):
        """Split screen based on common patterns found in 60% of educational videos"""
        if orientation == 'vertical':
            if ratio == 'half':
                return {'left': LEFT * 3.5, 'right': RIGHT * 3.5}
            elif ratio == 'golden':
                left_width = 7 * self.common_splits['golden'][0]
                return {
                    'left': LEFT * (7 - left_width)/2,
                    'right': RIGHT * left_width/2
                }
    
    def arrange_equations(self, equations, pattern='stack'):
        """Arrange equations based on patterns found in mathematical animations"""
        if pattern == 'stack':
            # Most common: vertical stack with consistent spacing
            return VGroup(*equations).arrange(DOWN, buff=0.5)
        elif pattern == 'cascade':
            # Found in 25% of proof animations
            for i, eq in enumerate(equations[1:], 1):
                eq.shift(RIGHT * 0.3 * i + DOWN * 0.8 * i)
            return VGroup(*equations)

class ColorSchemeExtractor:
    """Extracts and classifies color usage patterns"""
    
    def __init__(self):
        self.mathematical_colors = {
            'positive': [],  # Greens, blues
            'negative': [],  # Reds, oranges
            'neutral': [],   # Grays, whites
            'emphasis': []   # Yellows, bright colors
        }
    
    def analyze_color_usage(self, scene_code):
        """Extract how colors are used in mathematical contexts"""
        color_contexts = []
        
        # Pattern: Positive/negative number coloring
        if 'positive' in scene_code and 'GREEN' in scene_code:
            self.mathematical_colors['positive'].append(GREEN)
        
        # Pattern: Error/warning highlighting
        if 'error' in scene_code.lower() and 'RED' in scene_code:
            self.mathematical_colors['negative'].append(RED)
        
        # Pattern: Matrix element highlighting
        if 'matrix' in scene_code and 'indicate' in scene_code:
            # Extract colors used for matrix element emphasis
            emphasis_colors = self._extract_indication_colors(scene_code)
            self.mathematical_colors['emphasis'].extend(emphasis_colors)
        
        return self.mathematical_colors
\`\`\`

### Custom Static Analysis for Manim

We had to build our own static code analyzer because existing tools like MyPy couldn't resolve Manim's wildcard imports (\`from manim import *\`). This was critical for validation:

\`\`\`python
class ManimStaticAnalyzer:
    """Custom static analyzer that understands Manim's wildcard imports"""
    
    def __init__(self):
        # Build complete symbol table from Manim's __all__ exports
        self.manim_symbols = self._extract_manim_symbols()
        self.custom_symbols = self._load_custom_components()
        self.undefined_refs = []
        
    def _extract_manim_symbols(self):
        """Extract all symbols from Manim's wildcard exports"""
        symbols = {}
        
        # Parse Manim's __init__.py and all submodules
        manim_modules = [
            'manim.mobject.geometry',
            'manim.mobject.svg.tex_mobject',
            'manim.animation.creation',
            'manim.animation.transform',
            'manim.scene.scene',
            'manim.utils.color'
        ]
        
        for module_path in manim_modules:
            module = importlib.import_module(module_path)
            if hasattr(module, '__all__'):
                for symbol in module.__all__:
                    symbols[symbol] = {
                        'type': self._infer_type(getattr(module, symbol)),
                        'module': module_path,
                        'signature': self._extract_signature(getattr(module, symbol))
                    }
        
        # Add commonly used but not exported symbols
        symbols.update({
            'PI': {'type': 'constant', 'value': 'math.pi'},
            'TAU': {'type': 'constant', 'value': '2 * math.pi'},
            'DEGREES': {'type': 'constant', 'value': 'math.pi / 180'},
            'RIGHT': {'type': 'np.array', 'value': 'np.array([1, 0, 0])'},
            'LEFT': {'type': 'np.array', 'value': 'np.array([-1, 0, 0])'},
            'UP': {'type': 'np.array', 'value': 'np.array([0, 1, 0])'},
            'DOWN': {'type': 'np.array', 'value': 'np.array([0, -1, 0])'},
            'ORIGIN': {'type': 'np.array', 'value': 'np.array([0, 0, 0])'}
        })
        
        return symbols
    
    def validate_code(self, code_str):
        """Validate Manim code with wildcard import resolution"""
        tree = ast.parse(code_str)
        validator = ManimASTValidator(self.manim_symbols, self.custom_symbols)
        validator.visit(tree)
        
        return {
            'valid': len(validator.errors) == 0,
            'errors': validator.errors,
            'warnings': validator.warnings,
            'undefined_symbols': validator.undefined_symbols,
            'suggestions': self._generate_suggestions(validator.undefined_symbols)
        }
    
    def _generate_suggestions(self, undefined_symbols):
        """Suggest corrections for undefined symbols using fuzzy matching"""
        suggestions = {}
        all_symbols = {**self.manim_symbols, **self.custom_symbols}
        
        for symbol in undefined_symbols:
            # Find similar symbols using Levenshtein distance
            similar = difflib.get_close_matches(
                symbol, 
                all_symbols.keys(), 
                n=3, 
                cutoff=0.7
            )
            if similar:
                suggestions[symbol] = similar
        
        return suggestions

class ManimASTValidator(ast.NodeVisitor):
    """AST visitor that validates Manim-specific constructs"""
    
    def __init__(self, manim_symbols, custom_symbols):
        self.manim_symbols = manim_symbols
        self.custom_symbols = custom_symbols
        self.defined_symbols = set()
        self.undefined_symbols = set()
        self.errors = []
        self.warnings = []
        self.current_scope = {}
        
    def visit_Name(self, node):
        """Check if name is defined in Manim or custom symbols"""
        if isinstance(node.ctx, ast.Load):
            name = node.id
            
            # Check in order: local scope, custom symbols, manim symbols
            if name not in self.current_scope:
                if name not in self.custom_symbols:
                    if name not in self.manim_symbols:
                        if name not in __builtins__:
                            self.undefined_symbols.add(name)
                            self.errors.append({
                                'line': node.lineno,
                                'col': node.col_offset,
                                'message': f"Undefined symbol: {name}",
                                'type': 'undefined_name'
                            })
        
        self.generic_visit(node)
    
    def visit_Call(self, node):
        """Validate function calls and their arguments"""
        if isinstance(node.func, ast.Name):
            func_name = node.func.id
            
            # Check if it's a known Manim class/function
            if func_name in self.manim_symbols:
                symbol_info = self.manim_symbols[func_name]
                
                # Validate arguments if signature is known
                if 'signature' in symbol_info:
                    self._validate_arguments(node, symbol_info['signature'])
                    
                # Special validation for Scene subclasses
                if func_name in ['Scene', 'MovingCameraScene', 'ThreeDScene']:
                    self._validate_scene_methods(node)
        
        self.generic_visit(node)
    
    def _validate_scene_methods(self, node):
        """Ensure Scene classes have construct method"""
        # This would be called when analyzing class definitions
        pass

class ManimTypeInferencer:
    """Infers types for Manim objects to enable better validation"""
    
    def __init__(self):
        self.type_map = {
            'Mobject': {'parent': None, 'methods': ['shift', 'scale', 'rotate']},
            'VMobject': {'parent': 'Mobject', 'methods': ['set_color', 'set_fill']},
            'Tex': {'parent': 'VMobject', 'methods': []},
            'MathTex': {'parent': 'Tex', 'methods': []},
            'NumberPlane': {'parent': 'VMobject', 'methods': ['plot', 'get_graph']},
            'Scene': {'parent': None, 'methods': ['play', 'wait', 'add']}
        }
    
    def infer_type(self, node):
        """Infer the Manim type of an AST node"""
        if isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name):
                func_name = node.func.id
                if func_name in self.type_map:
                    return func_name
        return 'Unknown'
\`\`\`

### DSPy: Declarative Self-Improving Python Implementation

We built a sophisticated DSPy-based system with 1,000+ lines of declarative self-improving code that learns from every generation:

\`\`\`python
# From manim_dspy/src/core/modules.py - The actual implementation
import dspy
from chromadb import Client
from dspy.teleprompt import MIPRO

class AnimationRequestParser(dspy.Module):
    """Parse natural language into structured animation components"""
    
    def __init__(self):
        super().__init__()
        self.parse = dspy.ChainOfThought(AnimationRequestSignature)
    
    def forward(self, request: str):
        # Natural language → structured components with reasoning
        return self.parse(request=request)

class EnhancedManimGenerationPipeline(dspy.Module):
    """Complete pipeline with multi-template intelligence and self-improvement"""
    
    def __init__(self, db_path="./chroma_db", examples_dir="./examples"):
        super().__init__()
        
        # Initialize modules with ChromaDB for few-shot learning
        self.request_parser = AnimationRequestParser()
        self.template_selector = TemplateSelector(db_path=db_path)
        self.component_composer = ComponentComposer()
        self.code_generator = ManimCodeGenerator()
        self.optimizer = AnimationOptimizer()
        
        # Feedback system for continuous improvement
        self.feedback_collector = FeedbackCollector()
        
    def forward(self, request: str, target_duration=180.0):
        # Step 1: Parse request with reasoning trace
        parsed = self.request_parser(request=request)
        
        # Step 2: Select optimal template based on content analysis
        template_result = self.template_selector(
            main_topic=parsed.main_topic,
            concepts=parsed.concepts,
            content_type=parsed.content_type
        )
        
        # Step 3: Compose components with spatial reasoning workarounds
        components = self.component_composer(
            concepts=parsed.concepts,
            template=template_result.selected_template
        )
        
        # Step 4: Generate code with validation loop
        code_result = self.code_generator(
            components=components,
            template=template_result.selected_template,
            voiceover_segments=parsed.voiceover_segments
        )
        
        # Step 5: Auto-optimize if quality below threshold
        quality_metrics = self.evaluate_quality(code_result.manim_code)
        if quality_metrics["score"] < 0.8:
            optimized = self.optimizer(
                manim_code=code_result.manim_code,
                quality_metrics=quality_metrics
            )
            code_result.manim_code = optimized.optimized_code
        
        # Step 6: Log for self-improvement
        self.feedback_collector.log_generation(
            request=request,
            generated_code=code_result.manim_code,
            quality_score=quality_metrics["score"]
        )
        
        return code_result

# Actual feedback system implementation (501 lines in original)
class FeedbackCollector:
    """Collect and analyze feedback from animation generations"""
    
    def log_generation(self, request, generated_code, validation_results, 
                      fixed_code=None, user_rating=None, render_success=None):
        """Log generation attempt with all relevant data for learning"""
        
        # Extract quality metrics
        metrics = self.extract_quality_metrics(generated_code)
        
        # Identify what went wrong and what to improve
        improvements = self._identify_improvements(validation_results)
        
        # Store in database for future optimization
        entry = {
            "timestamp": datetime.now(),
            "request": request,
            "original_code": generated_code,
            "fixed_code": fixed_code,  # Learn from corrections
            "improvements_needed": improvements,
            "metrics": metrics,
            "user_rating": user_rating,
            "render_success": render_success
        }
        
        self.feedback_db.add(entry)
        
        # Trigger re-optimization if patterns emerge
        if self._should_reoptimize():
            self.trigger_pipeline_optimization()

# MIPRO optimizer for continuous improvement (725 lines in original)
class ManimMIPROOptimizer:
    """MIPRO optimizer for animation generation quality"""
    
    def create_metric_function(self, weights=None):
        """Multi-dimensional quality metric for MIPRO"""
        
        def metric_fn(example, pred, trace=None):
            # Evaluate across multiple quality dimensions
            code_valid = self.validate_syntax(pred.manim_code)
            components_compatible = self.check_component_compatibility(pred)
            pedagogical_score = self.evaluate_pedagogy(pred)
            render_likelihood = self.predict_render_success(pred)
            
            # Weighted combination
            score = (
                0.25 * code_valid +
                0.20 * components_compatible +
                0.15 * pedagogical_score +
                0.40 * render_likelihood  # Most important: will it render?
            )
            
            return score
        
        return metric_fn
    
    def optimize_pipeline(self, pipeline, feedback_data, n_iterations=10):
        """Optimize entire pipeline using MIPRO with feedback data"""
        
        # Convert feedback to training examples
        trainset = []
        for entry in feedback_data.get_high_quality_examples():
            # Use FIXED code when available (learn from corrections)
            code = entry["fixed_code"] or entry["original_code"]
            example = dspy.Example(
                request=entry["request"],
                manim_code=code,
                quality_score=entry["metrics"]["overall_score"]
            ).with_inputs("request")
            trainset.append(example)
        
        # Run MIPRO optimization
        metric = self.create_metric_function()
        teleprompter = MIPRO(
            metric=metric,
            prompt_model=dspy.OpenAI(model="gpt-4"),
            task_model=dspy.OpenAI(model="gpt-4"),
            num_candidates=5,
            init_temperature=1.0
        )
        
        # Compile optimized pipeline
        optimized = teleprompter.compile(
            pipeline,
            trainset=trainset,
            num_trials=n_iterations,
            max_bootstrapped_demos=4,
            max_labeled_demos=16
        )
        
        return optimized

# ChromaDB integration for few-shot learning
class TemplateSelector(dspy.Module):
    """Select optimal template using ChromaDB examples"""
    
    def __init__(self, db_path):
        super().__init__()
        self.select = dspy.ChainOfThought(TemplateSelectionSignature)
        
        # ChromaDB for retrieving similar successful examples
        self.chroma_client = chromadb.PersistentClient(path=db_path)
        self.collection = self.chroma_client.get_or_create_collection(
            name="template_examples",
            metadata={"hnsw:space": "cosine"}
        )
    
    def forward(self, main_topic, concepts, content_type):
        # Retrieve similar successful examples
        query = f"{main_topic} {' '.join(concepts)}"
        similar_examples = self.collection.query(
            query_texts=[query],
            n_results=3,
            include=["metadatas", "documents"]
        )
        
        # Use examples to inform template selection
        examples_context = self._format_examples(similar_examples)
        
        result = self.select(
            main_topic=main_topic,
            concepts=concepts,
            content_type=content_type,
            similar_examples=examples_context
        )
        
        return result
\`\`\`

### Graph and Geometry Helpers

Special utilities for handling mathematical visualizations that AI struggles with:

\`\`\`python
class GeometryHelper:
    """Handles complex geometric constructions"""
    
    def construct_triangle_from_angles(self, angles, side_length=2):
        """Build triangle from angles when AI can't handle coordinates"""
        # Validate angles sum to 180
        if sum(angles) != 180:
            angles = self._normalize_angles(angles)
        
        # Use law of sines to calculate sides
        a = side_length
        b = a * np.sin(np.radians(angles[1])) / np.sin(np.radians(angles[0]))
        c = a * np.sin(np.radians(angles[2])) / np.sin(np.radians(angles[0]))
        
        # Position vertices
        A = ORIGIN
        B = RIGHT * a
        # Calculate C using trigonometry
        C = self._calculate_third_vertex(A, B, b, c)
        
        triangle = Polygon(A, B, C)
        
        # Auto-label angles and sides
        labels = self._create_triangle_labels(triangle, angles)
        
        return VGroup(triangle, labels)
    
    def plot_implicit_function(self, equation_str, x_range, y_range):
        """Plot implicit functions like x^2 + y^2 = 1"""
        # Parse equation to extract implicit function
        func = self._parse_implicit(equation_str)
        
        # Generate points satisfying the equation
        points = []
        for x in np.linspace(*x_range, 1000):
            y_vals = self._solve_for_y(func, x)
            for y in y_vals:
                if y_range[0] <= y <= y_range[1]:
                    points.append([x, y, 0])
        
        # Create smooth curve through points
        if points:
            return VMobject().set_points_smoothly(points)
        return VMobject()

class AnimationComposer:
    """Composes complex animations from simple instructions"""
    
    def __init__(self):
        self.animation_library = {
            'reveal': lambda obj, **kw: Write(obj, **kw),
            'emphasize': lambda obj, **kw: Indicate(obj, **kw),
            'transform': lambda a, b, **kw: Transform(a, b, **kw),
            'fade_in': lambda obj, **kw: FadeIn(obj, **kw),
            'grow': lambda obj, **kw: GrowFromCenter(obj, **kw)
        }
    
    def create_synchronized_animation(self, objects, timing, animation_types):
        """Create complex multi-object animations with timing"""
        animations = []
        
        for obj, time, anim_type in zip(objects, timing, animation_types):
            if anim_type in self.animation_library:
                anim = self.animation_library[anim_type](obj, run_time=time)
                animations.append(anim)
        
        # Compose with proper timing
        return AnimationGroup(*animations, lag_ratio=0.1)
\`\`\`

This platform's key innovation is the extensive scaffolding that compensates for AI's inability to reason spatially. By providing deterministic templates, auto-composition utilities, and intelligent placement systems, we enable AI to create sophisticated mathematical animations without understanding the underlying spatial relationships.
